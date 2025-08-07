// Placeholder auth controller - will be fully implemented later
const authController = {
  register: (req, res) => {
    res.json({ message: 'Register endpoint - to be implemented' });
  },

  login: (req, res) => {
    res.json({ message: 'Login endpoint - to be implemented' });
  },

  refresh: (req, res) => {
    res.json({ message: 'Refresh token endpoint - to be implemented' });
  },

  logout: (req, res) => {
    res.json({ message: 'Logout endpoint - to be implemented' });
  }
};

module.exports = authController;
