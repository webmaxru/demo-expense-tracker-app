const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { mockDataService } = require('../services/mockDataService');

// Apply auth middleware
router.use(authMiddleware);

// Get all categories for user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const categories = mockDataService.getCategories(userId);
  res.json(categories);
});

module.exports = router;
