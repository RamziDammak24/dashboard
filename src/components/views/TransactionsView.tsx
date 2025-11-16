'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/types';
import { Trash2, Edit2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({ type: 'expense' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Transaction>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.montant || !formData.raison) return;
    
    try {
      const now = new Date();
      await addDoc(collection(db, 'transactions'), {
        montant: Number(formData.montant),
        raison: formData.raison,
        type: formData.type,
        timestamp: now.toISOString(),
        date: now.toISOString().split('T')[0],
        cashierId: formData.cashierId || '',
        cashierName: formData.cashierName || ''
      });
      setIsAdding(false);
      setFormData({ type: 'expense' });
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    
    try {
      await deleteDoc(doc(db, 'transactions', id));
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL transactions? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting all transactions:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'transactions', id), editFormData);
      setEditingId(null);
      setEditFormData({});
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading transactions...</div>;
  }

  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
            Delete All
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">New Transaction</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.type || 'expense'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="border rounded px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={formData.montant || ''}
              onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Reason"
              value={formData.raison || ''}
              onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
              className="border rounded px-3 py-2 col-span-2"
            />
            <input
              type="text"
              placeholder="Cashier Name (optional)"
              value={formData.cashierName || ''}
              onChange={(e) => setFormData({ ...formData, cashierName: e.target.value })}
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save
            </button>
            <button onClick={() => { setIsAdding(false); setFormData({ type: 'expense' }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                {editingId === transaction.id ? (
                  <>
                    <td className="px-6 py-4 text-sm">{new Date(transaction.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={editFormData.type || 'expense'}
                        onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value as 'income' | 'expense' })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editFormData.raison || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, raison: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editFormData.montant || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, montant: Number(e.target.value) })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editFormData.cashierName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, cashierName: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(transaction.id)} className="text-green-600 hover:text-green-800">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditFormData({}); }} className="text-gray-600 hover:text-gray-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm">{new Date(transaction.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{transaction.raison}</td>
                    <td className={`px-6 py-4 font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.montant} DT
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.cashierName || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(transaction.id); setEditFormData(transaction); }} className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
