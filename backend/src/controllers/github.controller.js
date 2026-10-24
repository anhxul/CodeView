const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Review = require('../models/Review.model');
const githubService = require('../services/github.service');
const geminiService = require('../services/gemini.service');

const MAX_FILES_TO_ANALYZE = 5;

/**
 * @route POST /api/github/files
 * Lists analyzable code files in a GitHub repository so the user can
 * choose which one(s) to review.
 */
const listRepoFiles = catchAsync(async (req, res) => {
  const { repoUrl } = req.body;

  const { owner, repo, files } = await githubService.listAnalyzableFiles(repoUrl, 30);

  if (files.length === 0) {
    throw ApiError.notFound('No analyzable source files found in this repository');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        owner,
        repo,
        files,
      },
      'Repository files fetched'
    )
  );
});

/**
 * @route POST /api/github/analyze
 * Fetches a specific file's content from a GitHub repo, runs an AI review,
 * and saves it as a Review document.
 */
const analyzeRepoFile = catchAsync(async (req, res) => {
  const { repoUrl, filePath, sha, language } = req.body;

  if (!filePath || !sha) {
    throw ApiError.badRequest('filePath and sha are required');
  }

  const { owner, repo } = githubService.parseRepoUrl(repoUrl);
  const content = await githubService.getFileContent(owner, repo, sha);

  if (!content || content.trim().length === 0) {
    throw ApiError.badRequest('Selected file is empty');
  }

  const detectedLanguage = language || githubService.detectLanguageFromPath(filePath);

  const review = await Review.create({
    user: req.user._id,
    code: content.slice(0, 50000),
    language: detectedLanguage,
    title: `${repo}/${filePath}`,
    source: 'github',
    githubMeta: { repoUrl, filePath },
    status: 'pending',
  });

  try {
    const result = await geminiService.reviewCode(review.code, detectedLanguage);
    review.result = result;
    review.status = 'completed';
    await review.save();
  } catch (err) {
    review.status = 'failed';
    review.error = err.message;
    await review.save();
    throw err;
  }

  return res.status(201).json(new ApiResponse(201, { review }, 'Repository file analyzed'));
});

module.exports = { listRepoFiles, analyzeRepoFile };
