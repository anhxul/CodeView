    const express = require('express');
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const { sendMessageValidator, chatIdParamValidator } = require('../validators/chat.validator');

const router = express.Router();

router.use(protect);

router.post('/', aiLimiter, sendMessageValidator, validate, chatController.sendMessage);
router.get('/', chatController.getChats);
router.get('/:chatId', chatIdParamValidator, validate, chatController.getChatById);
router.delete('/:chatId', chatIdParamValidator, validate, chatController.deleteChat);

module.exports = router;