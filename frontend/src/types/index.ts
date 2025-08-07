export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId?: string;
  amount: string; // Using string for Decimal precision
  description?: string;
  date: string;
  type: 'income' | 'expense';
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: string; // Using string for Decimal precision
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
  category: Category;
}

export interface CreateTransactionRequest {
  categoryId?: string;
  amount: number;
  description?: string;
  date: string;
  type: 'income' | 'expense';
}

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardData {
  totalIncome: string;
  totalExpenses: string;
  balance: string;
  recentTransactions: Transaction[];
  categoryBreakdown: Array<{
    category: Category;
    total: string;
    percentage: number;
  }>;
  budgetProgress: Array<{
    budget: Budget;
    spent: string;
    remaining: string;
    percentage: number;
  }>;
}

export interface ApiError {
  error: string;
  details?: any;
}
