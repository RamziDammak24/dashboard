'use client';

import { useState } from 'react';
import { Database, Package, DollarSign, Users, Calendar, FileText, RefreshCw } from 'lucide-react';
import ProductsView from './views/ProductsView';
import StockView from './views/StockView';
import TransactionsView from './views/TransactionsView';
import EmployeesView from './views/EmployeesView';
import WeeklyTemplatesView from './views/WeeklyTemplatesView';
import ReportsView from './views/ReportsView';
import TestDataGenerator from './TestDataGenerator';

type ViewType = 'products' | 'stock' | 'transactions' | 'employees' | 'templates' | 'reports' | 'generator';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('products');

  const menuItems = [
    { id: 'products' as ViewType, label: 'Products', icon: Package, color: 'text-blue-600' },
    { id: 'stock' as ViewType, label: 'Stock', icon: Database, color: 'text-green-600' },
    { id: 'transactions' as ViewType, label: 'Transactions', icon: DollarSign, color: 'text-yellow-600' },
    { id: 'employees' as ViewType, label: 'Employees', icon: Users, color: 'text-purple-600' },
    { id: 'templates' as ViewType, label: 'Weekly Templates', icon: Calendar, color: 'text-pink-600' },
    { id: 'reports' as ViewType, label: 'Reports', icon: FileText, color: 'text-indigo-600' },
    { id: 'generator' as ViewType, label: 'Test Data', icon: RefreshCw, color: 'text-orange-600' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'products':
        return <ProductsView />;
      case 'stock':
        return <StockView />;
      case 'transactions':
        return <TransactionsView />;
      case 'employees':
        return <EmployeesView />;
      case 'templates':
        return <WeeklyTemplatesView />;
      case 'reports':
        return <ReportsView />;
      case 'generator':
        return <TestDataGenerator />;
      default:
        return <ProductsView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Patisserie</h1>
          <p className="text-sm text-gray-500 mt-1">Developer Dashboard</p>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeView === item.id
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeView === item.id ? item.color : 'text-gray-400'}`} />
                <span className={`font-medium ${activeView === item.id ? 'text-gray-900' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
