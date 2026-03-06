/**
 * Centralized Error Handling Middleware
 * Catches all errors thrown in routes/controllers and sends a formatted response
 * Must be registered LAST in the Express middleware chain
 */
const errorMiddleware = (err, req, res, next) => {
    // Default to 500 Internal Server Error if no status code is set
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error details to the console in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ Error:', {
            message: err.message,
            statusCode,
            stack: err.stack,
        });
    }

    // Handle specific Mongoose errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages,
        });
    }

    // Handle duplicate key errors (e.g., duplicate email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `Duplicate value for field: ${field}. Please use a different value.`,
        });
    }

    // Handle invalid ObjectId errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;
