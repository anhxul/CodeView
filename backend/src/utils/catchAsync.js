/**
 * Wraps an async controller function and forwards any thrown error to
 * Express's error-handling middleware via next().
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;