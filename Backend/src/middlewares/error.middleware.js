const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let details = err.details;

    // Mongoose: bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Mongoose: duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `${field} already exists`;
    }
    // Mongoose: validation
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        details = Object.values(err.errors).map((e) => e.message);
    }
    // Multer: file too large, etc.
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : err.message;
    }
    // JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Invalid or expired token';
    }

    if (statusCode >= 500) {
        console.error('Unhandled error:', err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(env.isProd ? {} : { stack: err.stack }),
    });
}

module.exports = { notFoundHandler, errorHandler };
