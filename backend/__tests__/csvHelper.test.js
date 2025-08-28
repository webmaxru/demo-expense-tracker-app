const { transactionsToCsv, escapeCsvField, generateExportFilename } = require('../src/utils/csvHelper');

describe('CSV Helper', () => {
  describe('escapeCsvField', () => {
    it('should return empty string for null or undefined', () => {
      expect(escapeCsvField(null)).toBe('');
      expect(escapeCsvField(undefined)).toBe('');
    });

    it('should return simple values unchanged', () => {
      expect(escapeCsvField('simple')).toBe('simple');
      expect(escapeCsvField(123)).toBe('123');
    });

    it('should wrap values with commas in quotes', () => {
      expect(escapeCsvField('value, with comma')).toBe('"value, with comma"');
    });

    it('should wrap values with newlines in quotes', () => {
      expect(escapeCsvField('value\nwith newline')).toBe('"value\nwith newline"');
    });

    it('should escape quotes by doubling them and wrap in quotes', () => {
      expect(escapeCsvField('value with "quotes"')).toBe('"value with ""quotes"""');
    });
  });

  describe('transactionsToCsv', () => {
    it('should generate CSV with headers only for empty array', () => {
      const csv = transactionsToCsv([]);
      const expectedHeaders = 'id,date,type,categoryName,description,amount,currency,createdAt,updatedAt';
      expect(csv).toBe(expectedHeaders);
    });

    it('should generate CSV with proper formatting for transactions', () => {
      const transactions = [
        {
          id: 'trans-1',
          date: '2024-01-15T00:00:00.000Z',
          type: 'expense',
          category: { name: 'Food & Dining' },
          description: 'Coffee and breakfast',
          amount: '25.50',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 'trans-2',
          date: '2024-01-14T00:00:00.000Z',
          type: 'income',
          category: null,
          description: 'Freelance work with "quotes" and, comma',
          amount: '100.00',
          createdAt: '2024-01-14T15:20:00.000Z',
          updatedAt: '2024-01-14T15:20:00.000Z'
        }
      ];

      const csv = transactionsToCsv(transactions);
      const lines = csv.split('\n');
      
      expect(lines[0]).toBe('id,date,type,categoryName,description,amount,currency,createdAt,updatedAt');
      expect(lines[1]).toBe('trans-1,2024-01-15,expense,Food & Dining,Coffee and breakfast,25.50,USD,2024-01-15T10:30:00.000Z,2024-01-15T10:30:00.000Z');
      expect(lines[2]).toBe('trans-2,2024-01-14,income,,"Freelance work with ""quotes"" and, comma",100.00,USD,2024-01-14T15:20:00.000Z,2024-01-14T15:20:00.000Z');
    });
  });

  describe('generateExportFilename', () => {
    it('should generate filename with timestamp for csv', () => {
      const filename = generateExportFilename('csv');
      expect(filename).toMatch(/^transactions_\d{8}_\d{6}\.csv$/);
    });

    it('should generate filename with timestamp for json', () => {
      const filename = generateExportFilename('json');
      expect(filename).toMatch(/^transactions_\d{8}_\d{6}\.json$/);
    });
  });
});