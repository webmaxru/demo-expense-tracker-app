const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const budgetController = require('../controllers/budgetController');

// Secure all budget routes
router.use(authMiddleware);

// Budgets CRUD
router.get('/', budgetController.getBudgets);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

// Budget progress
router.get('/:id/progress', budgetController.getBudgetProgress);

module.exports = router;
