const { mockDataService } = require('../services/mockDataService');
const { logger } = require('../utils/logger');
const { transactionsToCsv, generateExportFilename } = require('../utils/csvHelper');
const Joi = require('joi');

// Validation schemas
const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(500).allow(''),
  categoryId: Joi.string().optional(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('income', 'expense').required()
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional(),
  description: Joi.string().max(500).allow('').optional(),
  categoryId: Joi.string().optional().allow(null),
  date: Joi.date().iso().optional(),
  type: Joi.string().valid('income', 'expense').optional()
});

const exportTransactionsSchema = Joi.object({
  format: Joi.string().valid('csv', 'json').default('csv'),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

const transactionController = {
  // Get all transactions for a user
  getTransactions: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { category, type } = req.query;

      const transactions = mockDataService.getTransactions(userId, {
        categoryId: category,
        type
      });

      res.json({
        data: transactions,
        pagination: {
          page: 1,
          limit: 20,
          total: transactions.length,
          pages: 1
        }
      });
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      next(error);
    }
  },

  // Get a single transaction
  getTransaction: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transaction = mockDataService.getTransaction(id, userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      next(error);
    }
  },

  // Create a new transaction
  createTransaction: async (req, res, next) => {
    try {
      const { error, value } = createTransactionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const userId = req.user.id;
      const { amount, description, categoryId, date, type } = value;

      // Verify category exists if provided
      if (categoryId) {
        const category = mockDataService.getCategoryById(categoryId, userId);
        if (!category) {
          return res.status(400).json({ error: 'Invalid category' });
        }
      }

      const transaction = mockDataService.createTransaction({
        amount,
        description: description || '',
        categoryId: categoryId || null,
        date,
        type
      }, userId);

      logger.info(`Transaction created: ${transaction.id} for user: ${userId}`);
      res.status(201).json(transaction);
    } catch (error) {
      logger.error('Error creating transaction:', error);
      next(error);
    }
  },

  // Update a transaction
  updateTransaction: async (req, res, next) => {
    try {
      const { error, value } = updateTransactionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const userId = req.user.id;

      // Verify category if provided
      if (value.categoryId) {
        const category = mockDataService.getCategoryById(value.categoryId, userId);
        if (!category) {
          return res.status(400).json({ error: 'Invalid category' });
        }
      }

      const transaction = mockDataService.updateTransaction(id, value, userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      logger.info(`Transaction updated: ${transaction.id} for user: ${userId}`);
      res.json(transaction);
    } catch (error) {
      logger.error('Error updating transaction:', error);
      next(error);
    }
  },

  // Delete a transaction
  deleteTransaction: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = mockDataService.deleteTransaction(id, userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      logger.info(`Transaction deleted: ${id} for user: ${userId}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      next(error);
    }
  },

  // Export transactions as CSV or JSON
  exportTransactions: async (req, res, next) => {
    try {
      const { error, value } = exportTransactionsSchema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const userId = req.user.id;
      const { format, type, category, startDate, endDate } = value;

      // Get filtered transactions
      const transactions = mockDataService.getTransactions(userId, {
        type,
        categoryId: category,
        startDate,
        endDate
      });

      const filename = generateExportFilename(format);

      if (format === 'json') {
        // JSON export
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        logger.info(`JSON export completed for user: ${userId}, ${transactions.length} transactions`);
        return res.json(transactions);
      } else {
        // CSV export (default)
        const csvData = transactionsToCsv(transactions);
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        logger.info(`CSV export completed for user: ${userId}, ${transactions.length} transactions`);
        return res.send(csvData);
      }
    } catch (error) {
      logger.error('Error exporting transactions:', error);
      next(error);
    }
  }
};

module.exports = transactionController;
