import axios from 'axios';
import type {
  Transaction,
  Category,
  Budget,
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  CreateTransactionRequest,
  CreateCategoryRequest,
  CreateBudgetRequest,
  DashboardData
} from '../types';
import type { SpendingTrends, CategoryBreakdown, MonthlyReport } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: AuthRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
    
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
    
  logout: (): Promise<void> =>
    api.post('/auth/logout').then(res => res.data),
    
  refresh: (refreshToken: string): Promise<{ accessToken: string }> =>
    api.post('/auth/refresh', { refreshToken }).then(res => res.data),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params?: { page?: number; limit?: number; category?: string }): Promise<{ data: Transaction[]; pagination: { page: number; limit: number; total: number } }> =>
    api.get('/transactions', { params }).then(res => res.data),
    
  getById: (id: string): Promise<Transaction> =>
    api.get(`/transactions/${id}`).then(res => res.data),
    
  create: (data: CreateTransactionRequest): Promise<Transaction> =>
    api.post('/transactions', data).then(res => res.data),
    
  update: (id: string, data: Partial<CreateTransactionRequest>): Promise<Transaction> =>
    api.put(`/transactions/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> =>
    api.delete(`/transactions/${id}`).then(res => res.data),
    
  export: (params: {
    format?: 'csv' | 'json';
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<Blob> =>
    api.get('/transactions/export', { 
      params,
      responseType: 'blob'
    }).then(res => res.data),
    
  uploadReceipt: (id: string, file: File): Promise<{ receiptUrl: string }> => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post(`/transactions/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: (): Promise<Category[]> =>
    api.get('/categories').then(res => res.data),
    
  create: (data: CreateCategoryRequest): Promise<Category> =>
    api.post('/categories', data).then(res => res.data),
    
  update: (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> =>
    api.put(`/categories/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> =>
    api.delete(`/categories/${id}`).then(res => res.data),
};

// Budgets API
export const budgetsAPI = {
  getAll: (): Promise<Budget[]> =>
    api.get('/budgets').then(res => res.data),
    
  create: (data: CreateBudgetRequest): Promise<Budget> =>
    api.post('/budgets', data).then(res => res.data),
    
  update: (id: string, data: Partial<CreateBudgetRequest>): Promise<Budget> =>
    api.put(`/budgets/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> =>
    api.delete(`/budgets/${id}`).then(res => res.data),
    
  getProgress: (id: string): Promise<{ spent: string; remaining: string; percentage: number }> =>
    api.get(`/budgets/${id}/progress`).then(res => res.data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (): Promise<DashboardData> =>
    api.get('/analytics/dashboard').then(res => res.data),
    
  getSpendingTrends: (period: 'week' | 'month' | 'year'): Promise<SpendingTrends> =>
    api.get(`/analytics/spending-trends?period=${period}`).then(res => res.data),
    
  getCategoryBreakdown: (period: 'week' | 'month' | 'year'): Promise<CategoryBreakdown> =>
    api.get(`/analytics/category-breakdown?period=${period}`).then(res => res.data),
    
  getMonthlyReport: (month: string, year: string): Promise<MonthlyReport> =>
    api.get(`/analytics/monthly-report?month=${month}&year=${year}`).then(res => res.data),
};

export default api;
