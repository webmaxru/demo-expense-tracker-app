const request = require('supertest');
const express = require('express');
const transactionController = require('../src/controllers/transactionController');
const { mockDataService } = require('../src/services/mockDataService');

// Mock the services
jest.mock('../src/services/mockDataService');
jest.mock('../src/utils/logger');

// Create a simple express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
});

// Add the route
app.get('/api/transactions/export', transactionController.exportTransactionsCsv);

describe('GET /api/transactions/export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should export transactions as CSV with correct headers', async () => {
    // Mock data
    const mockTransactions = [
      {
        id: 'trans-1',
        date: '2023-12-01T00:00:00.000Z',
        description: 'Coffee',
        type: 'expense',
        amount: '5.99',
        category: { name: 'Food' }
      },
      {
        id: 'trans-2',
        date: '2023-12-02T00:00:00.000Z',
        description: 'Salary',
        type: 'income',
        amount: '3000.00',
        category: { name: 'Work' }
      }
    ];

    mockDataService.getTransactions.mockReturnValue(mockTransactions);

    const response = await request(app)
      .get('/api/transactions/export')
      .expect(200);

    expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
    expect(response.headers['content-disposition']).toMatch(/attachment; filename="transactions-\d{4}-\d{2}-\d{2}\.csv"/);
    
    const csvContent = response.text;
    const lines = csvContent.split('\n');
    
    // Check header
    expect(lines[0]).toBe('id,date,description,category,type,amount');
    
    // Check data rows
    expect(lines[1]).toBe('trans-1,2023-12-01,Coffee,Food,expense,5.99');
    expect(lines[2]).toBe('trans-2,2023-12-02,Salary,Work,income,3000.00');

    expect(mockDataService.getTransactions).toHaveBeenCalledWith('test-user-id', {
      categoryId: undefined,
      type: undefined
    });
  });

  test('should respect category and type filters', async () => {
    const mockTransactions = [{
      id: 'trans-1',
      date: '2023-12-01T00:00:00.000Z',
      description: 'Coffee',
      type: 'expense',
      amount: '5.99',
      category: { name: 'Food' }
    }];

    mockDataService.getTransactions.mockReturnValue(mockTransactions);

    await request(app)
      .get('/api/transactions/export?category=food-cat&type=expense')
      .expect(200);

    expect(mockDataService.getTransactions).toHaveBeenCalledWith('test-user-id', {
      categoryId: 'food-cat',
      type: 'expense'
    });
  });

  test('should return header-only CSV when no transactions exist', async () => {
    mockDataService.getTransactions.mockReturnValue([]);

    const response = await request(app)
      .get('/api/transactions/export')
      .expect(200);

    expect(response.text).toBe('id,date,description,category,type,amount');
  });

  test('should handle CSV escaping for special characters', async () => {
    const mockTransactions = [{
      id: 'trans-1',
      date: '2023-12-01T00:00:00.000Z',
      description: 'Coffee, "expensive" one',
      type: 'expense',
      amount: '5.99',
      category: { name: 'Food & Drinks' }
    }];

    mockDataService.getTransactions.mockReturnValue(mockTransactions);

    const response = await request(app)
      .get('/api/transactions/export')
      .expect(200);

    const csvContent = response.text;
    const lines = csvContent.split('\n');
    
    // Check that special characters are properly escaped
    expect(lines[1]).toBe('trans-1,2023-12-01,"Coffee, ""expensive"" one",Food & Drinks,expense,5.99');
  });

  test('should handle missing/null fields', async () => {
    const mockTransactions = [{
      id: 'trans-1',
      date: '2023-12-01T00:00:00.000Z',
      description: '',
      type: 'expense',
      amount: '5.99',
      category: null
    }];

    mockDataService.getTransactions.mockReturnValue(mockTransactions);

    const response = await request(app)
      .get('/api/transactions/export')
      .expect(200);

    const csvContent = response.text;
    const lines = csvContent.split('\n');
    
    // Check that empty/null fields are handled properly
    expect(lines[1]).toBe('trans-1,2023-12-01,,,expense,5.99');
  });
});