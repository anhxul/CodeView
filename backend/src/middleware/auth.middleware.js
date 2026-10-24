const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../services/token.service');
const User = require('../models/User.model');

/**
 * Protects routes by verifying a JWT from the Authorization header
 * (Bearer token) or from an httpOnly cookie named "token".
 * Attaches the authenticated user to req.user.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token. Please log in again.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('User belonging to this token no longer exists.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated.');
  }

  req.user = user;
  next();
});

/**
 * Restricts access to specific roles. Use after `protect`.
 * @param  {...string} roles
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action.'));
  }
  return next();
};

module.exports = { protect, restrictTo };