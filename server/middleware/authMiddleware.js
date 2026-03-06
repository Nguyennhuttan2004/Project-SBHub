const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header
 * Attaches the authenticated user object to req.user
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Extract token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user and attach to request
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AppError('User not found. Token may be invalid.', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token.', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token has expired.', 401));
        }
        next(error);
    }
};

module.exports = authMiddleware;
