const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Review = require('../models/Review.model');
const geminiService = require('../services/gemini.service');

/**
 * @route POST /api/reviews
 * Performs a full AI code review and persists the result.
 */
const createReview = catchAsync(async (req, res) => {
  const { code, language, title } = req.body;

  // Create a pending review first so we have a record even if AI fails
  const review = await Review.create({
    user: req.user._id,
    code,
    language,
    title: title || `${language} review - ${new Date().toLocaleDateString()}`,
    status: 'pending',
  });

  try {
    const result = await geminiService.reviewCode(code, language);
    review.result = result;
    review.status = 'completed';
    await review.save();
  } catch (err) {
    review.status = 'failed';
    review.error = err.message;
    await review.save();
    throw err;
  }

  return res.status(201).json(new ApiResponse(201, { review }, 'Code review completed'));
});

/**
 * @route GET /api/reviews
 * Lists the authenticated user's reviews with pagination & filters.
 */
const getReviews = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.language) {
    filter.language = req.query.language.toLowerCase();
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .select('-code -result.refactoredCode -result.alternativeApproach.code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Reviews fetched'
    )
  );
});

/**
 * @route GET /api/reviews/:id
 */
const getReviewById = catchAsync(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  return res.status(200).json(new ApiResponse(200, { review }, 'Review fetched'));
});

/**
 * @route DELETE /api/reviews/:id
 */
const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
});

/**
 * @route POST /api/reviews/:id/explain
 * Returns a line-by-line AI explanation of the review's code.
 */
const explainReview = catchAsync(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  const explanation = await geminiService.explainCode(review.code, review.language);

  return res.status(200).json(new ApiResponse(200, { explanation }, 'Explanation generated'));
});

/**
 * @route POST /api/reviews/explain
 * Explains arbitrary code without requiring a saved review.
 */
const explainCode = catchAsync(async (req, res) => {
  const { code, language } = req.body;

  const explanation = await geminiService.explainCode(code, language);

  return res.status(200).json(new ApiResponse(200, { explanation }, 'Explanation generated'));
});

/**
 * @route GET /api/reviews/stats
 * Dashboard statistics for the authenticated user.
 */
const getReviewStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [totalReviews, completedReviews, languageAgg, scoreAgg, securityAgg] = await Promise.all([
    Review.countDocuments({ user: userId }),
    Review.countDocuments({ user: userId, status: 'completed' }),
    Review.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Review.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$result.overallScore' },
        },
      },
    ]),
    Review.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $project: { count: { $size: { $ifNull: ['$result.securityIssues', []] } } } },
      { $group: { _id: null, totalSecurityIssues: { $sum: '$count' } } },
    ]),
  ]);

  // Recent score trend (last 10 completed reviews)
  const recentReviews = await Review.find({ user: userId, status: 'completed' })
    .select('result.overallScore language createdAt title')
    .sort({ createdAt: -1 })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalReviews,
        completedReviews,
        averageScore: scoreAgg[0] ? Math.round(scoreAgg[0].avgScore || 0) : 0,
        languagesUsed: languageAgg.map((l) => ({ language: l._id, count: l.count })),
        securityIssuesFound: securityAgg[0] ? securityAgg[0].totalSecurityIssues : 0,
        scoreTrend: recentReviews.reverse().map((r) => ({
          id: r._id,
          title: r.title,
          language: r.language,
          score: r.result?.overallScore || 0,
          date: r.createdAt,
        })),
      },
      'Stats fetched'
    )
  );
});

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
  explainReview,
  explainCode,
  getReviewStats,
};