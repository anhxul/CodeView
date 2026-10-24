const express = require('express');
const githubController = require('../controllers/github.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const { githubAnalyzeValidator } = require('../validators/review.validator');

const router = express.Router();

router.use(protect);

router.post('/files', githubAnalyzeValidator, validate, githubController.listRepoFiles);
router.post('/analyze', aiLimiter, githubController.analyzeRepoFile);

module.exports = router;