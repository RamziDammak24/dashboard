'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Report } from '@/types';
import { FileText, Edit2, Trash2, Save, X } from 'lucide-react';

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Report>>({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reports_archive'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      setReports(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reports_archive', id), editFormData);
      setEditingId(null);
      setEditFormData({});
      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await deleteDoc(doc(db, 'reports_archive', id));
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL reports? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'reports_archive'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchReports();
    } catch (error) {
      console.error('Error deleting all reports:', error);
    }
  };

  const startEdit = (report: Report) => {
    setEditingId(report.id);
    setEditFormData(report);
  };

  if (loading) {
    return <div className="text-center py-12">Loading reports...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Reports Archive</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Total: {reports.length}</div>
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
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="font-semibold">{report.fileName}</h3>
                <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{report.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                {editingId === report.id ? (
                  <input
                    type="number"
                    value={editFormData.totalSales || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, totalSales: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-20"
                  />
                ) : (
                  <span className="font-medium text-green-600">{report.totalSales.toFixed(2)} DT</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                {editingId === report.id ? (
                  <input
                    type="number"
                    value={editFormData.totalExpenses || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, totalExpenses: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-20"
                  />
                ) : (
                  <span className="font-medium text-red-600">{report.totalExpenses.toFixed(2)} DT</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income:</span>
                {editingId === report.id ? (
                  <input
                    type="number"
                    value={editFormData.totalIncome || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, totalIncome: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-20"
                  />
                ) : (
                  <span className="font-medium text-blue-600">{report.totalIncome.toFixed(2)} DT</span>
                )}
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-semibold">Final Total:</span>
                <span className={`font-bold ${report.finalTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.finalTotal.toFixed(2)} DT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cashiers:</span>
                {editingId === report.id ? (
                  <input
                    type="number"
                    value={editFormData.cashiersCount || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, cashiersCount: Number(e.target.value) })}
                    className="border rounded px-2 py-1 text-sm w-20"
                  />
                ) : (
                  <span className="font-medium">{report.cashiersCount}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saved Locally:</span>
                {editingId === report.id ? (
                  <select
                    value={editFormData.savedLocally ? 'yes' : 'no'}
                    onChange={(e) => setEditFormData({ ...editFormData, savedLocally: e.target.value === 'yes' })}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span className={`font-medium ${report.savedLocally ? 'text-green-600' : 'text-gray-400'}`}>
                    {report.savedLocally ? 'Yes' : 'No'}
                  </span>
                )}
              </div>
            </div>

            {editingId === report.id && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleUpdate(report.id)} className="text-green-600 hover:text-green-800">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditingId(null); setEditFormData({}); }} className="text-gray-600 hover:text-gray-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => startEdit(report)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12 text-gray-500">No reports found</div>
      )}
    </div>
  );
}
