const { body, param } = require('express-validator');

const sendMessageValidator = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 1, max: 4000 }).withMessage('Message must be between 1 and 4000 characters'),
  body('chatId')
    .optional()
    .isMongoId().withMessage('Invalid chat ID'),
  body('reviewId')
    .optional()
    .isMongoId().withMessage('Invalid review ID'),
];

const chatIdParamValidator = [
  param('chatId').isMongoId().withMessage('Invalid chat ID'),
];

module.exports = { sendMessageValidator, chatIdParamValidator };
