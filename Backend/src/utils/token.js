const jwt = require('jsonwebtoken');
const env = require('../config/env');

const COOKIE_NAME = 'token';

function signToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Cookie options that work for a cross-site SPA in production (frontend and
 * backend on different domains) while staying lax-and-insecure in local dev.
 */
function cookieOptions() {
    return {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    };
}

module.exports = { COOKIE_NAME, signToken, verifyToken, cookieOptions };
