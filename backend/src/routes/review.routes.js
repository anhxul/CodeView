const express = require('express');
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const { reviewCodeValidator, explainCodeValidator } = require('../validators/review.validator');

const router = express.Router();

router.use(protect);

router.get('/stats', reviewController.getReviewStats);

router.post('/', aiLimiter, reviewCodeValidator, validate, reviewController.createReview);
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.delete('/:id', reviewController.deleteReview);
router.post('/:id/explain', aiLimiter, reviewController.explainReview);
router.post('/explain', aiLimiter, explainCodeValidator, validate, reviewController.explainCode);

module.exports = router;
