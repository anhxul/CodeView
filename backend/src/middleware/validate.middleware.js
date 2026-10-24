const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator chains; collects errors and forwards
 * a single ApiError with all validation messages.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  return next(ApiError.badRequest('Validation failed', formatted));
};

module.exports = validate;