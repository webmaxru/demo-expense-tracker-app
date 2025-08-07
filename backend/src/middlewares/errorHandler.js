const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Validation errors
  if (err.isJoi) {
    error.message = err.details[0].message;
    error.status = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // Prisma errors
  if (err.code === 'P2002') {
    error.message = 'A record with this information already exists';
    error.status = 409;
  }

  if (err.code === 'P2025') {
    error.message = 'Record not found';
    error.status = 404;
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
