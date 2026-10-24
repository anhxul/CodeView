const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const Settings = require('../models/Settings.model');

/**
 * @route GET /api/settings
 * Fetches the authenticated user's settings, creating defaults if absent.
 */
const getSettings = catchAsync(async (req, res) => {
  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    settings = await Settings.create({ user: req.user._id });
  }

  return res.status(200).json(new ApiResponse(200, { settings }, 'Settings fetched'));
});

/**
 * @route PATCH /api/settings
 * Updates the authenticated user's settings (partial update supported).
 */
const updateSettings = catchAsync(async (req, res) => {
  const allowedTopLevel = ['theme', 'defaultLanguage', 'editor', 'notifications'];
  const updates = {};

  allowedTopLevel.forEach((key) => {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  });

  const settings = await Settings.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, { settings }, 'Settings updated'));
});

module.exports = { getSettings, updateSettings };