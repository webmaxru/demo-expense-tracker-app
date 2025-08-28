// Simple in-memory data store for development
// This will be replaced with Prisma when database is configured

const { v4: uuidv4 } = require('uuid');

// Mock data storage
let transactions = [
  {
    id: 'trans-1',
    userId: 'user-1',
    amount: '25.50',
    description: 'Coffee and breakfast',
    categoryId: 'cat-1',
    date: '2024-01-15T00:00:00.000Z',
    type: 'expense',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 'trans-2',
    userId: 'user-1',
    amount: '100.00',
    description: 'Gas station',
    categoryId: 'cat-2',
    date: '2024-01-14T00:00:00.000Z',
    type: 'expense',
    createdAt: '2024-01-14T15:20:00.000Z',
    updatedAt: '2024-01-14T15:20:00.000Z'
  },
  {
    id: 'trans-3',
    userId: 'user-1',
    amount: '3500.00',
    description: 'Monthly salary',
    categoryId: 'cat-3',
    date: '2024-01-01T00:00:00.000Z',
    type: 'income',
    createdAt: '2024-01-01T09:00:00.000Z',
    updatedAt: '2024-01-01T09:00:00.000Z'
  },
  {
    id: 'trans-4',
    userId: 'user-1',
    amount: '45.75',
    description: 'Grocery shopping with "special" items',
    categoryId: 'cat-1',
    date: '2024-01-10T00:00:00.000Z',
    type: 'expense',
    createdAt: '2024-01-10T18:45:00.000Z',
    updatedAt: '2024-01-10T18:45:00.000Z'
  }
];
let categories = [
  {
    id: 'cat-1',
    userId: 'user-1',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#ef4444',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-2',
    userId: 'user-1',
    name: 'Transportation',
    icon: 'car',
    color: '#3b82f6',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-3',
    userId: 'user-1',
    name: 'Salary',
    icon: 'banknotes',
    color: '#10b981',
    type: 'income',
    createdAt: new Date().toISOString()
  }
];

const mockDataService = {
  // Transactions
  getTransactions: (userId, filters = {}) => {
    let filtered = transactions.filter(t => t.userId === userId);
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.categoryId) {
      filtered = filtered.filter(t => t.categoryId === filters.categoryId);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      // Make endDate inclusive by adding one day and using <
      const inclusiveEndDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.date) < inclusiveEndDate);
    }
    
    return filtered
      .map(t => ({
        ...t,
        category: categories.find(c => c.id === t.categoryId)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getTransaction: (id, userId) => {
    const transaction = transactions.find(t => t.id === id && t.userId === userId);
    if (transaction) {
      return {
        ...transaction,
        category: categories.find(c => c.id === transaction.categoryId)
      };
    }
    return null;
  },

  createTransaction: (data, userId) => {
    const transaction = {
      id: uuidv4(),
      userId,
      ...data,
      amount: parseFloat(data.amount).toFixed(2),
      date: new Date(data.date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(transaction);
    
    return {
      ...transaction,
      category: categories.find(c => c.id === transaction.categoryId)
    };
  },

  updateTransaction: (id, data, userId) => {
    const index = transactions.findIndex(t => t.id === id && t.userId === userId);
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...data,
      ...(data.amount && { amount: parseFloat(data.amount).toFixed(2) }),
      ...(data.date && { date: new Date(data.date).toISOString() }),
      updatedAt: new Date().toISOString()
    };
    
    return {
      ...transactions[index],
      category: categories.find(c => c.id === transactions[index].categoryId)
    };
  },

  deleteTransaction: (id, userId) => {
    const index = transactions.findIndex(t => t.id === id && t.userId === userId);
    if (index === -1) return false;
    
    transactions.splice(index, 1);
    return true;
  },

  // Categories
  getCategories: (userId) => {
    return categories.filter(c => c.userId === userId);
  },

  getCategoryById: (id, userId) => {
    return categories.find(c => c.id === id && c.userId === userId);
  }
};

module.exports = { mockDataService };
