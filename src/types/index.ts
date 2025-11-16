export interface Product {
  id: string;
  name: string;
  price: number;
  piecesPerTray: number;
  targetValue: number;
  targetType: 'pieces' | 'plateaux';
}

export interface Stock {
  id: string;
  productName: string;
  productId: string;
  piecesPerTray: number;
  targetType: string;
  percentage: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  totalItemsProduced: number;
  plateausInFreezer: number;
  plateausHolding: number;
  plateausReadyToSell: number;
  itemsInPOS: number;
  itemsSoldToday: number;
  cashierSessions?: CashierSession[];
}

export interface CashierSession {
  cashierId: string;
  cashierName: string;
  loginTime: { _seconds: number; _nanoseconds: number };
  logoutTime?: { _seconds: number; _nanoseconds: number };
  startingStock: number;
  endingStock?: number;
  itemsSold: number;
  plateausReceived: number;
  initialPlateausReadyToSell?: number;
}

export interface Transaction {
  id: string;
  montant: number;
  raison: string;
  type: 'income' | 'expense';
  timestamp: string;
  date: string;
  cashierId?: string;
  cashierName?: string;
}

export interface Employee {
  id: string;
  name: string;
  type: 'caissier' | 'boulanger';
  pin?: string;
}

export interface WeeklyTemplate {
  id: string;
  employeeId: string;
  products: ProductSchedule[];
}

export interface ProductSchedule {
  productId: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  repetitiveDays: string[];
  updatedAt: string;
}

export interface Report {
  id: string;
  date: string;
  type: 'daily_report';
  fileName: string;
  createdAt: string;
  totalSales: number;
  totalExpenses: number;
  totalIncome: number;
  finalTotal: number;
  cashiersCount: number;
  savedLocally: boolean;
}

export type CollectionName = 
  | 'products' 
  | 'stock' 
  | 'transactions' 
  | 'employees' 
  | 'weeklyTemplates' 
  | 'reports_archive';
