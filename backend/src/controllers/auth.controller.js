const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User.model');
const Settings = require('../models/Settings.model');
const { generateToken } = require('../services/token.service');
const env = require('../config/env');

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.env === 'production',
  sameSite: env.env === 'production' ? 'none' : 'lax',
  maxAge: env.jwtCookieExpiresIn * 24 * 60 * 60 * 1000,
});

const sendAuthResponse = (res, statusCode, user, message) => {
  const token = generateToken(user._id);

  res.cookie('token', token, cookieOptions());

  return res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      {
        user: user.toSafeObject(),
        token,
      },
      message
    )
  );
};

/**
 * @route POST /api/auth/signup
 */
const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  // Create default settings for the new user
  await Settings.create({ user: user._id });

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return sendAuthResponse(res, 201, user, 'Account created successfully');
});

/**
 * @route POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return sendAuthResponse(res, 200, user, 'Logged in successfully');
});

/**
 * @route POST /api/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  res.clearCookie('token', cookieOptions());
  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

/**
 * @route GET /api/auth/me
 */
const getMe = catchAsync(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user.toSafeObject() }, 'User fetched'));
});

/**
 * @route PATCH /api/auth/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, 'Profile updated'));
});

/**
 * @route PATCH /api/auth/change-password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return sendAuthResponse(res, 200, user, 'Password updated successfully');
});

/**
 * @route DELETE /api/auth/account
 */
const deleteAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.clearCookie('token', cookieOptions());
  return res.status(200).json(new ApiResponse(200, null, 'Account deactivated successfully'));
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
};