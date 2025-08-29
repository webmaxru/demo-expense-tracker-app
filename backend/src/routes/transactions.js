const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Transaction routes
router.get('/', transactionController.getTransactions);
router.get('/export', transactionController.exportTransactionsCsv);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
