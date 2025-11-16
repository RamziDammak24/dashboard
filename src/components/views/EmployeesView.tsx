'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types';
import { Edit2, Trash2, Save, X, User } from 'lucide-react';

export default function EmployeesView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updateData: any = { ...formData };
      await updateDoc(doc(db, 'employees', id), updateData);
      setEditingId(null);
      setFormData({});
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    
    try {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL employees? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting all employees:', error);
    }
  };

  const startEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData(employee);
  };

  if (loading) {
    return <div className="text-center py-12">Loading employees...</div>;
  }

  const cashiers = employees.filter(e => e.type === 'caissier');
  const bakers = employees.filter(e => e.type === 'boulanger');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Employees</h2>
        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <Trash2 className="w-5 h-5" />
          Delete All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-600">Cashiers ({cashiers.length})</h3>
          <div className="space-y-3">
            {cashiers.map((employee) => (
              <div key={employee.id} className="bg-white p-4 rounded-lg shadow-md">
                {editingId === employee.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="text"
                      placeholder="PIN"
                      maxLength={4}
                      value={formData.pin || ''}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(employee.id)} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingId(null); setFormData({}); }} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">{employee.name}</p>
                        <p className="text-xs text-gray-500">PIN: {employee.pin || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(employee)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Bakers ({bakers.length})</h3>
          <div className="space-y-3">
            {bakers.map((employee) => (
              <div key={employee.id} className="bg-white p-4 rounded-lg shadow-md">
                {editingId === employee.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(employee.id)} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingId(null); setFormData({}); }} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-600" />
                      <p className="font-semibold">{employee.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(employee)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
