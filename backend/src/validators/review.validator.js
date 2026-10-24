const { body } = require('express-validator');

const SUPPORTED_LANGUAGES = [
  'python', 'java', 'c', 'cpp', 'javascript', 'typescript',
  'go', 'rust', 'php', 'kotlin', 'swift',
];

const reviewCodeValidator = [
  body('code')
    .notEmpty().withMessage('Code is required')
    .isLength({ min: 1, max: 50000 }).withMessage('Code must be between 1 and 50000 characters'),
  body('language')
    .notEmpty().withMessage('Language is required')
    .toLowerCase()
    .isIn(SUPPORTED_LANGUAGES).withMessage('Unsupported language'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
];

const explainCodeValidator = [
  body('code')
    .notEmpty().withMessage('Code is required')
    .isLength({ min: 1, max: 50000 }).withMessage('Code must be between 1 and 50000 characters'),
  body('language')
    .notEmpty().withMessage('Language is required')
    .toLowerCase()
    .isIn(SUPPORTED_LANGUAGES).withMessage('Unsupported language'),
];

const githubAnalyzeValidator = [
  body('repoUrl')
    .notEmpty().withMessage('Repository URL is required')
    .matches(/^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/i)
    .withMessage('Must be a valid GitHub repository URL'),
];

module.exports = {
  reviewCodeValidator,
  explainCodeValidator,
  githubAnalyzeValidator,
  SUPPORTED_LANGUAGES,
};
