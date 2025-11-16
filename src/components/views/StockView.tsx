'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Stock } from '@/types';
import { Trash2, Package, Edit2, Save, X } from 'lucide-react';

export default function StockView() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Stock>>({});

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'stock'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Stock[];
      setStock(data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stock item?')) return;
    
    try {
      await deleteDoc(doc(db, 'stock', id));
      fetchStock();
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'stock', id), editFormData);
      setEditingId(null);
      setEditFormData({});
      fetchStock();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const startEdit = (item: Stock) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL stock items? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'stock'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchStock();
    } catch (error) {
      console.error('Error deleting all stock:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading stock...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Stock Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Items: {stock.length}
          </div>
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
            Delete All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stock.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">{item.productName}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editFormData.date || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium">{item.date}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Produced:</span>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editFormData.totalItemsProduced || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, totalItemsProduced: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium">{item.totalItemsProduced}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Freezer:</span>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editFormData.plateausInFreezer || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, plateausInFreezer: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium text-blue-600">{item.plateausInFreezer}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ready to Sell:</span>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editFormData.plateausReadyToSell || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, plateausReadyToSell: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium text-green-600">{item.plateausReadyToSell}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In POS:</span>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editFormData.itemsInPOS || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, itemsInPOS: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium text-purple-600">{item.itemsInPOS}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sold Today:</span>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editFormData.itemsSoldToday || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, itemsSoldToday: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  <span className="font-medium text-orange-600">{item.itemsSoldToday}</span>
                )}
              </div>
              {item.cashierSessions && item.cashierSessions.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <span className="text-gray-600 text-xs">Sessions: {item.cashierSessions.length}</span>
                </div>
              )}
              {editingId === item.id && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleUpdate(item.id)} className="text-green-600 hover:text-green-800">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingId(null); setEditFormData({}); }} className="text-gray-600 hover:text-gray-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {stock.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No stock items found
        </div>
      )}
    </div>
  );
}
