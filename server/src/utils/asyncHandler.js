/**
 * Express Async Controller Wrapper to catch rejected promises and forward to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
