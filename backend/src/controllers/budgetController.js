const Joi = require('joi');
const { mockDataService } = require('../services/mockDataService');
const { logger } = require('../utils/logger');

const createBudgetSchema = Joi.object({
  categoryId: Joi.string().required(),
  amount: Joi.number().positive().precision(2).required(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

const updateBudgetSchema = Joi.object({
  categoryId: Joi.string().optional(),
  amount: Joi.number().positive().precision(2).optional(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

const budgetController = {
  getBudgets: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const budgets = mockDataService.getBudgets(userId);
      res.json(budgets);
    } catch (error) {
      logger.error('Error fetching budgets:', error);
      next(error);
    }
  },

  createBudget: async (req, res, next) => {
    try {
      const { error, value } = createBudgetSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;

      // Validate category
      const category = mockDataService.getCategoryById(value.categoryId, userId);
      if (!category) return res.status(400).json({ error: 'Invalid category' });
      if (category.type !== 'expense') {
        return res.status(400).json({ error: 'Budget can only be set for expense categories' });
      }

      const created = mockDataService.createBudget(value, userId);
      res.status(201).json(created);
    } catch (error) {
      logger.error('Error creating budget:', error);
      next(error);
    }
  },

  updateBudget: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { error, value } = updateBudgetSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      if (value.categoryId) {
        const category = mockDataService.getCategoryById(value.categoryId, userId);
        if (!category) return res.status(400).json({ error: 'Invalid category' });
        if (category.type !== 'expense') {
          return res.status(400).json({ error: 'Budget can only be set for expense categories' });
        }
      }

      const updated = mockDataService.updateBudget(id, value, userId);
      if (!updated) return res.status(404).json({ error: 'Budget not found' });

      res.json(updated);
    } catch (error) {
      logger.error('Error updating budget:', error);
      next(error);
    }
  },

  deleteBudget: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = mockDataService.deleteBudget(id, userId);
      if (!deleted) return res.status(404).json({ error: 'Budget not found' });

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting budget:', error);
      next(error);
    }
  },

  getBudgetProgress: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const progress = mockDataService.getBudgetProgress(id, userId);
      if (!progress) return res.status(404).json({ error: 'Budget not found' });
      res.json(progress);
    } catch (error) {
      logger.error('Error fetching budget progress:', error);
      next(error);
    }
  }
};

module.exports = budgetController;
