const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Analytics endpoint' });
});

module.exports = router;
