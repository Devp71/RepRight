const errorHandler = (err, req, res, next) => {
  console.error('[SYSTEM_ERROR]', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      details: errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'DUPLICATE_ENTRY',
      message: `An account with this ${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'INVALID_ID',
      message: 'Invalid resource identifier',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Authentication token is invalid',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
    });
  }

  // Generic fallback
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: 'SYSTEM_ERROR',
    message: err.message || 'An unexpected error occurred',
  });
};

module.exports = { errorHandler };
