const path = require('path');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Review = require('../models/Review.model');
const Report = require('../models/Report.model');
const { generateReviewPDF } = require('../services/pdf.service');

/**
 * @route POST /api/reports/:reviewId
 * Generates a PDF report for a review and returns a download link.
 */
const generateReport = catchAsync(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.reviewId, user: req.user._id });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.status !== 'completed') {
    throw ApiError.badRequest('Cannot generate a report for an incomplete review');
  }

  const filePath = await generateReviewPDF(review);
  const fileName = path.basename(filePath);

  const report = await Report.create({
    user: req.user._id,
    review: review._id,
    fileName,
    format: 'pdf',
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        report,
        downloadUrl: `/api/reports/download/${report._id}`,
      },
      'Report generated successfully'
    )
  );
});

/**
 * @route GET /api/reports
 */
const getReports = catchAsync(async (req, res) => {
  const reports = await Report.find({ user: req.user._id })
    .populate('review', 'title language createdAt')
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, { reports }, 'Reports fetched'));
});

/**
 * @route GET /api/reports/download/:reportId
 */
const downloadReport = catchAsync(async (req, res) => {
  const report = await Report.findOne({ _id: req.params.reportId, user: req.user._id });

  if (!report) {
    throw ApiError.notFound('Report not found');
  }

  const filePath = path.join(__dirname, '../../reports', report.fileName);

  if (!fs.existsSync(filePath)) {
    throw ApiError.notFound('Report file no longer exists');
  }

  res.download(filePath, `codeview-report-${report._id}.pdf`);
});

module.exports = { generateReport, getReports, downloadReport };