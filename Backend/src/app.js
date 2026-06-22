const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

function createApp() {
    const app = express();

    app.set('trust proxy', 1); // correct client IPs behind Railway/Render proxy

    app.use(helmet());
    app.use(compression());

    app.use(
        cors({
            origin(origin, cb) {
                // Allow non-browser clients (no Origin) and configured origins.
                if (!origin || env.corsOrigins === '*') return cb(null, true);
                if (env.corsOrigins.includes(origin)) return cb(null, true);
                cb(new Error(`Origin ${origin} not allowed by CORS`));
            },
            credentials: true,
        })
    );

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cookieParser());

    if (!env.isTest) {
        app.use(morgan(env.isProd ? 'combined' : 'dev'));
    }

    // Global rate limit (auth endpoints get a stricter one below).
    app.use(
        '/api',
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 300,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        message: { success: false, message: 'Too many attempts, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.get('/api/health', (req, res) => {
        const mongoose = require('mongoose');
        res.status(200).json({
            success: true,
            message: 'BiteTok API is healthy',
            timestamp: new Date().toISOString(),
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        });
    });

    app.use('/api/auth', authLimiter, authRoutes);
    app.use('/api/food', foodRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
