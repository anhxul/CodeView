const express = require('express');

const authRoutes = require('./auth.routes');
const reviewRoutes = require('./review.routes');
const chatRoutes = require('./chat.routes');
const historyRoutes = require('./history.routes');
const reportRoutes = require('./report.routes');
const settingsRoutes = require('./settings.routes');
const githubRoutes = require('./github.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CodeView API is healthy', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/reviews', reviewRoutes);
router.use('/chat', chatRoutes);
router.use('/history', historyRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);
router.use('/github', githubRoutes);

module.exports = router;