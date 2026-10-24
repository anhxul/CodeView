const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', settingsController.getSettings);
router.patch('/', settingsController.updateSettings);

module.exports = router;