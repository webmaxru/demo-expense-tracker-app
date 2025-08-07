// Simple auth middleware for development
// This will be replaced with proper JWT auth later
const authMiddleware = (req, res, next) => {
  // For now, create a mock user for development
  // In production, this would verify JWT token
  req.user = {
    id: 'user-1', // Mock user ID
    email: 'demo@example.com'
  };
  
  next();
};

module.exports = { authMiddleware };
