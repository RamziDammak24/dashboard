'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RefreshCw, Package, Database, DollarSign, Users, FileText, Calendar, Trash2 } from 'lucide-react';

export default function TestDataGenerator() {
  const [generating, setGenerating] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [productsCount, setProductsCount] = useState(5);
  const [stockCount, setStockCount] = useState(10);
  const [transactionsCount, setTransactionsCount] = useState(20);
  const [employeesCount, setEmployeesCount] = useState(4);
  const [reportsCount, setReportsCount] = useState(5);
  const [weeklyTemplatesCount, setWeeklyTemplatesCount] = useState(3);
  const [deleting, setDeleting] = useState(false);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const productNames = [
    'Croissant', 'Pain au chocolat', 'Éclair', 'Macaron', 'Tarte', 
    'Madeleine', 'Financier', 'Cannelé', 'Religieuse', 'Paris-Brest'
  ];

  const transactionReasons = [
    'Chawarma', 'Hlib', 'Credit', 'Salma', 'Salary', 'Rent', 'Utilities', 'Supplies'
  ];

  const generateProducts = async (count: number) => {
    addLog(`Generating ${count} products...`);
    for (let i = 0; i < count; i++) {
      const product = {
        name: `${productNames[Math.floor(Math.random() * productNames.length)]} ${i + 1}`,
        price: Math.random() * 5 + 1,
        piecesPerTray: Math.floor(Math.random() * 30) + 5,
        targetValue: Math.floor(Math.random() * 50) + 1,
        targetType: Math.random() > 0.5 ? 'pieces' : 'plateaux'
      };
      await addDoc(collection(db, 'products'), product);
    }
    addLog(`✓ Generated ${count} products`);
  };

  const generateStock = async (count: number) => {
    addLog(`Generating ${count} stock items...`);
    
    // Fetch existing products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const existingProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      let productId, productName;
      if (existingProducts.length > 0) {
        const randomProduct = existingProducts[Math.floor(Math.random() * existingProducts.length)];
        productId = randomProduct.id;
        productName = randomProduct.name;
      } else {
        // Fallback if no products exist
        productId = `test_${Math.random().toString(36).substr(2, 9)}`;
        productName = `${productNames[Math.floor(Math.random() * productNames.length)]}`;
      }
      
      const stock = {
        productName,
        productId,
        piecesPerTray: Math.floor(Math.random() * 20) + 5,
        targetType: Math.random() > 0.5 ? 'pieces' : 'plateaux',
        percentage: Math.floor(Math.random() * 100),
        date: date.toISOString().split('T')[0],
        createdAt: date.toISOString(),
        updatedAt: new Date().toISOString(),
        totalItemsProduced: Math.floor(Math.random() * 200) + 10,
        plateausInFreezer: Math.floor(Math.random() * 30),
        plateausHolding: Math.floor(Math.random() * 10),
        plateausReadyToSell: Math.floor(Math.random() * 20),
        itemsInPOS: Math.floor(Math.random() * 50),
        itemsSoldToday: Math.floor(Math.random() * 30)
      };
      await addDoc(collection(db, 'stock'), stock);
    }
    addLog(`✓ Generated ${count} stock items`);
  };

  const generateTransactions = async (count: number) => {
    addLog(`Generating ${count} transactions...`);
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const transaction = {
        montant: Math.floor(Math.random() * 200) + 10,
        raison: transactionReasons[Math.floor(Math.random() * transactionReasons.length)],
        type: Math.random() > 0.3 ? 'expense' : 'income',
        timestamp: date.toISOString(),
        date: date.toISOString().split('T')[0],
        cashierId: `cashier_${Math.floor(Math.random() * 5) + 1}`,
        cashierName: ['Zied', 'Amal', 'Ahmed', 'Sarah'][Math.floor(Math.random() * 4)]
      };
      await addDoc(collection(db, 'transactions'), transaction);
    }
    addLog(`✓ Generated ${count} transactions`);
  };

  const generateEmployees = async (count: number) => {
    addLog(`Generating ${count} employees...`);
    const names = ['Ahmed', 'Mohamed', 'Sarah', 'Fatima', 'Ali', 'Amina', 'Karim', 'Nour'];
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.5 ? 'caissier' : 'boulanger';
      const employee: any = {
        name: `${names[Math.floor(Math.random() * names.length)]} ${i + 1}`,
        type
      };
      if (type === 'caissier') {
        employee.pin = String(Math.floor(Math.random() * 9000) + 1000);
      }
      await addDoc(collection(db, 'employees'), employee);
    }
    addLog(`✓ Generated ${count} employees`);
  };

  const generateReports = async (count: number) => {
    addLog(`Generating ${count} reports...`);
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const totalSales = Math.random() * 500;
      const totalExpenses = Math.random() * 300;
      const totalIncome = Math.random() * 200;
      
      const report = {
        date: date.toISOString().split('T')[0],
        type: 'daily_report',
        fileName: `report_${date.toISOString().split('T')[0]}.pdf`,
        createdAt: date.toISOString(),
        totalSales,
        totalExpenses,
        totalIncome,
        finalTotal: totalSales + totalIncome - totalExpenses,
        cashiersCount: Math.floor(Math.random() * 10) + 1,
        savedLocally: Math.random() > 0.3
      };
      await addDoc(collection(db, 'reports_archive'), report);
    }
    addLog(`✓ Generated ${count} reports`);
  };

  const generateWeeklyTemplates = async (count: number) => {
    addLog(`Generating ${count} weekly templates...`);
    for (let i = 0; i < count; i++) {
      const employeeId = `employee_${Math.floor(Math.random() * 10) + 1}`;
      const selectedProducts = productNames.slice(0, Math.floor(Math.random() * 5) + 3); // 3-8 products
      
      const products = selectedProducts.map(productName => ({
        productId: `product_${productName.toLowerCase().replace(/\s+/g, '_')}_${i}`,
        monday: Math.floor(Math.random() * 50) + 10,
        tuesday: Math.floor(Math.random() * 50) + 10,
        wednesday: Math.floor(Math.random() * 50) + 10,
        thursday: Math.floor(Math.random() * 50) + 10,
        friday: Math.floor(Math.random() * 50) + 10,
        saturday: Math.floor(Math.random() * 50) + 10,
        sunday: Math.floor(Math.random() * 50) + 10,
        repetitiveDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // example
        updatedAt: new Date().toISOString()
      }));
      
      const template = {
        employeeId,
        products
      };
      await addDoc(collection(db, 'weeklyTemplates'), template);
    }
    addLog(`✓ Generated ${count} weekly templates`);
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    setLog([]);
    addLog('Starting test data generation...');
    
    try {
      await generateProducts(5);
      await generateStock(10);
      await generateTransactions(20);
      await generateEmployees(4);
      await generateReports(5);
      await generateWeeklyTemplates(3);
      addLog('✓ All test data generated successfully!');
    } catch (error) {
      addLog(`✗ Error: ${error}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCustom = async (type: string, count: number) => {
    setGenerating(true);
    try {
      switch (type) {
        case 'products':
          await generateProducts(count);
          break;
        case 'stock':
          await generateStock(count);
          break;
        case 'transactions':
          await generateTransactions(count);
          break;
        case 'employees':
          await generateEmployees(count);
          break;
        case 'reports':
          await generateReports(count);
          break;
        case 'weeklyTemplates':
          await generateWeeklyTemplates(count);
          break;
      }
    } catch (error) {
      addLog(`✗ Error: ${error}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL test data? This action cannot be undone.')) return;
    
    setDeleting(true);
    setLog([]);
    addLog('Starting deletion of all test data...');
    
    try {
      const collections = ['products', 'stock', 'transactions', 'employees', 'reports_archive', 'weeklyTemplates'];
      for (const col of collections) {
        const querySnapshot = await getDocs(collection(db, col));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        addLog(`✓ Deleted all from ${col}`);
      }
      addLog('✓ All test data deleted successfully!');
    } catch (error) {
      addLog(`✗ Error: ${error}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Data Generator</h2>
        <p className="text-gray-600">Generate random test data for all collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-semibold">Products</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={productsCount}
              onChange={(e) => setProductsCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('products', productsCount)}
              disabled={generating || deleting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Generate Products
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold">Stock</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={stockCount}
              onChange={(e) => setStockCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('stock', stockCount)}
              disabled={generating || deleting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Generate Stock
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <h3 className="text-lg font-semibold">Transactions</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={transactionsCount}
              onChange={(e) => setTransactionsCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('transactions', transactionsCount)}
              disabled={generating || deleting}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Generate Transactions
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8 text-purple-600" />
            <h3 className="text-lg font-semibold">Employees</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={employeesCount}
              onChange={(e) => setEmployeesCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('employees', employeesCount)}
              disabled={generating || deleting}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Generate Employees
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-semibold">Reports</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={reportsCount}
              onChange={(e) => setReportsCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('reports', reportsCount)}
              disabled={generating || deleting}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Generate Reports
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-teal-600" />
            <h3 className="text-lg font-semibold">Weekly Templates</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={weeklyTemplatesCount}
              onChange={(e) => setWeeklyTemplatesCount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              onClick={() => handleGenerateCustom('weeklyTemplates', weeklyTemplatesCount)}
              disabled={generating || deleting}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
            >
              Generate Templates
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-8 h-8 text-orange-600" />
            <h3 className="text-lg font-semibold">Generate All</h3>
          </div>
          <button
            onClick={handleGenerateAll}
            disabled={generating || deleting}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            {generating ? 'Generating...' : 'Generate All Data'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className="w-8 h-8 text-red-600" />
          <h3 className="text-lg font-semibold">Delete All</h3>
        </div>
        <button
          onClick={handleDeleteAll}
          disabled={deleting || generating}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-start gap-2"
        >
          {deleting && <RefreshCw className="w-4 h-4 animate-spin" />}
          {deleting ? 'Deleting...' : 'Delete All Data'}
        </button>
      </div>

      {log.length > 0 && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          <h3 className="text-white font-semibold mb-2">Generation Log:</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
