/**
 * Custom Application Error class
 * Extends the built-in Error class to include HTTP status codes
 * Used for centralized error handling throughout the application
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes known errors from unexpected ones

        // Capture the stack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
