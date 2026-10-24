const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Converts non-ApiError errors (Mongoose, JWT, etc.) into ApiError instances.
 */
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.badRequest('Validation failed', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiError.conflict(`${field} already exists`);
  }

  // Mongoose invalid ObjectId / CastError
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token expired');
  }

  // Default fallback
  return ApiError.internal(err.message || 'Internal Server Error');
};

/**
 * 404 handler for unmatched routes.
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler. Must be registered last.
 */
const errorHandler = (err, req, res, next) => {
  const apiError = normalizeError(err);

  if (apiError.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${apiError.message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${apiError.message}`);
  }

  const response = {
    success: false,
    message: apiError.message,
    errors: apiError.errors || [],
  };

  if (env.env === 'development') {
    response.stack = err.stack;
  }

  res.status(apiError.statusCode || 500).json(response);
};

module.exports = { notFoundHandler, errorHandler };