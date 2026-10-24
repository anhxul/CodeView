const express = require('express');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/:reviewId', reportController.generateReport);
router.get('/', reportController.getReports);
router.get('/download/:reportId', reportController.downloadReport);

module.exports = router;