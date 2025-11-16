'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WeeklyTemplate } from '@/types';
import { Calendar, Edit2, Trash2, Save, X } from 'lucide-react';

export default function WeeklyTemplatesView() {
  const [templates, setTemplates] = useState<WeeklyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<WeeklyTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'weeklyTemplates'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WeeklyTemplate[];
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editFormData) return;
    try {
      await updateDoc(doc(db, 'weeklyTemplates', id), {
        employeeId: editFormData.employeeId,
        products: editFormData.products
      });
      setEditingId(null);
      setEditFormData(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await deleteDoc(doc(db, 'weeklyTemplates', id));
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL templates? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'weeklyTemplates'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting all templates:', error);
    }
  };

  const startEdit = (template: WeeklyTemplate) => {
    setEditingId(template.id);
    setEditFormData({ ...template });
  };

  if (loading) {
    return <div className="text-center py-12">Loading templates...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Weekly Templates</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Total: {templates.length}</div>
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
            Delete All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-semibold">
                  Employee: {editingId === template.id ? (
                    <input
                      type="text"
                      value={editFormData?.employeeId || ''}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, employeeId: e.target.value } : null)}
                      className="border rounded px-2 py-1 ml-2"
                    />
                  ) : (
                    template.employeeId
                  )}
                </h3>
              </div>
              <div className="flex gap-2">
                {editingId === template.id ? (
                  <>
                    <button onClick={() => handleUpdate(template.id)} className="text-green-600 hover:text-green-800">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditingId(null); setEditFormData(null); }} className="text-gray-600 hover:text-gray-800">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(template)} className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(template.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Product ID</th>
                    <th className="px-4 py-2 text-center">Mon</th>
                    <th className="px-4 py-2 text-center">Tue</th>
                    <th className="px-4 py-2 text-center">Wed</th>
                    <th className="px-4 py-2 text-center">Thu</th>
                    <th className="px-4 py-2 text-center">Fri</th>
                    <th className="px-4 py-2 text-center">Sat</th>
                    <th className="px-4 py-2 text-center">Sun</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(editingId === template.id ? editFormData?.products : template.products)?.map((product, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium text-xs">{product.productId.slice(0, 10)}...</td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.monday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], monday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.monday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.tuesday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], tuesday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.tuesday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.wednesday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], wednesday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.wednesday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.thursday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], thursday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.thursday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.friday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], friday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.friday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.saturday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], saturday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.saturday || '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {editingId === template.id ? (
                          <input
                            type="number"
                            value={product.sunday || ''}
                            onChange={(e) => {
                              if (editFormData) {
                                const newProducts = [...editFormData.products];
                                newProducts[idx] = { ...newProducts[idx], sunday: Number(e.target.value) };
                                setEditFormData({ ...editFormData, products: newProducts });
                              }
                            }}
                            className="border rounded px-1 py-1 text-xs w-12 text-center"
                          />
                        ) : (
                          product.sunday || '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-gray-500">No templates found</div>
      )}
    </div>
  );
}
