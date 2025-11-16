'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { Edit2, Trash2, Save, X } from 'lucide-react';

export default function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price) return;
    
    try {
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        price: Number(formData.price),
        piecesPerTray: Number(formData.piecesPerTray) || 1,
        targetValue: Number(formData.targetValue) || 1,
        targetType: formData.targetType || 'pieces'
      });
      setIsAdding(false);
      setFormData({});
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...formData
      });
      setEditingId(null);
      setFormData({});
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL products? This action cannot be undone.')) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting all products:', error);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <Trash2 className="w-5 h-5" />
          Delete All
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Pieces Per Tray"
              value={formData.piecesPerTray || ''}
              onChange={(e) => setFormData({ ...formData, piecesPerTray: Number(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Target Value"
              value={formData.targetValue || ''}
              onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <select
              value={formData.targetType || 'pieces'}
              onChange={(e) => setFormData({ ...formData, targetType: e.target.value as 'pieces' | 'plateaux' })}
              className="border rounded px-3 py-2"
            >
              <option value="pieces">Pieces</option>
              <option value="plateaux">Plateaux</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              <Save className="w-4 h-4 inline mr-2" />
              Save
            </button>
            <button onClick={() => { setIsAdding(false); setFormData({}); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pieces/Tray</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                {editingId === product.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.piecesPerTray || ''}
                        onChange={(e) => setFormData({ ...formData, piecesPerTray: Number(e.target.value) })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={formData.targetValue || ''}
                          onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                          className="border rounded px-2 py-1 w-20"
                        />
                        <select
                          value={formData.targetType || 'pieces'}
                          onChange={(e) => setFormData({ ...formData, targetType: e.target.value as 'pieces' | 'plateaux' })}
                          className="border rounded px-2 py-1"
                        >
                          <option value="pieces">pcs</option>
                          <option value="plateaux">plx</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(product.id)} className="text-green-600 hover:text-green-800">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingId(null); setFormData({}); }} className="text-gray-600 hover:text-gray-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">{product.price} DT</td>
                    <td className="px-6 py-4">{product.piecesPerTray}</td>
                    <td className="px-6 py-4">{product.targetValue} {product.targetType}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(product)} className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
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
    </div>
  );
}
