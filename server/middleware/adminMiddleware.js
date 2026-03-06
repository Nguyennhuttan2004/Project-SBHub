const AppError = require('../utils/AppError');

/**
 * Admin Authorization Middleware
 * Must be used AFTER authMiddleware (requires req.user to be set)
 * Checks if the authenticated user has the 'admin' role
 */
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(new AppError('Access denied. Admin privileges required.', 403));
    }
};

module.exports = adminMiddleware;
