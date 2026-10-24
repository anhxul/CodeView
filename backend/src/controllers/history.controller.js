const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const Review = require('../models/Review.model');

/**
 * @route GET /api/history
 * Returns a chronological history of the user's reviews with
 * lightweight summary info, supports search by title/language.
 */
const getHistory = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 15));
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.language) {
    filter.language = req.query.language.toLowerCase();
  }

  const [items, total] = await Promise.all([
    Review.find(filter)
      .select('title language status result.overallScore createdAt source githubMeta')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'History fetched'
    )
  );
});

module.exports = { getHistory };