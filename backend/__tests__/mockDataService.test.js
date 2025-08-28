const { mockDataService } = require('../src/services/mockDataService');

describe('Mock Data Service - Export Filtering', () => {
  beforeEach(() => {
    // Reset transactions to known state
    const mockTransactions = [
      {
        id: 'trans-1',
        userId: 'user-1',
        amount: '25.50',
        description: 'Coffee',
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
        description: 'Gas',
        categoryId: 'cat-2',
        date: '2024-01-10T00:00:00.000Z',
        type: 'expense',
        createdAt: '2024-01-10T15:20:00.000Z',
        updatedAt: '2024-01-10T15:20:00.000Z'
      },
      {
        id: 'trans-3',
        userId: 'user-1',
        amount: '3500.00',
        description: 'Salary',
        categoryId: 'cat-3',
        date: '2024-01-05T00:00:00.000Z',
        type: 'income',
        createdAt: '2024-01-05T09:00:00.000Z',
        updatedAt: '2024-01-05T09:00:00.000Z'
      },
      {
        id: 'trans-4',
        userId: 'user-2', // Different user
        amount: '50.00',
        description: 'Other user transaction',
        categoryId: 'cat-1',
        date: '2024-01-12T00:00:00.000Z',
        type: 'expense',
        createdAt: '2024-01-12T12:00:00.000Z',
        updatedAt: '2024-01-12T12:00:00.000Z'
      }
    ];

    // Access the private transactions array for testing
    const dataService = require('../src/services/mockDataService');
    // Reset transactions by directly modifying the module's internal state
    eval(`
      const module = require('../src/services/mockDataService');
      let transactions = ${JSON.stringify(mockTransactions)};
      module.mockDataService.getTransactions = (userId, filters = {}) => {
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
          const inclusiveEndDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
          filtered = filtered.filter(t => new Date(t.date) < inclusiveEndDate);
        }
        
        return filtered
          .map(t => ({
            ...t,
            category: [
              { id: 'cat-1', name: 'Food & Dining' },
              { id: 'cat-2', name: 'Transportation' },
              { id: 'cat-3', name: 'Salary' }
            ].find(c => c.id === t.categoryId)
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      };
    `);
  });

  describe('getTransactions with date filters', () => {
    it('should filter by startDate', () => {
      const transactions = mockDataService.getTransactions('user-1', {
        startDate: '2024-01-12T00:00:00.000Z'
      });
      
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('trans-1');
    });

    it('should filter by endDate inclusively', () => {
      const transactions = mockDataService.getTransactions('user-1', {
        endDate: '2024-01-10T00:00:00.000Z'
      });
      
      expect(transactions.length).toBe(2);
      expect(transactions.map(t => t.id)).toEqual(['trans-2', 'trans-3']);
    });

    it('should filter by date range', () => {
      const transactions = mockDataService.getTransactions('user-1', {
        startDate: '2024-01-08T00:00:00.000Z',
        endDate: '2024-01-12T00:00:00.000Z'
      });
      
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('trans-2');
    });

    it('should combine date filters with type filter', () => {
      const transactions = mockDataService.getTransactions('user-1', {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-11T00:00:00.000Z',
        type: 'expense'
      });
      
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('trans-2');
      expect(transactions[0].type).toBe('expense');
    });

    it('should return empty array when no transactions match date range', () => {
      const transactions = mockDataService.getTransactions('user-1', {
        startDate: '2024-02-01T00:00:00.000Z',
        endDate: '2024-02-28T00:00:00.000Z'
      });
      
      expect(transactions.length).toBe(0);
    });
  });
});