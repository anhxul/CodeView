const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  signupValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/signup', authLimiter, signupValidator, validate, authController.signup);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/logout', authController.logout);

router.get('/me', protect, authController.getMe);
router.patch('/profile', protect, updateProfileValidator, validate, authController.updateProfile);
router.patch(
  '/change-password',
  protect,
  changePasswordValidator,
  validate,
  authController.changePassword
);
router.delete('/account', protect, authController.deleteAccount);

module.exports = router;