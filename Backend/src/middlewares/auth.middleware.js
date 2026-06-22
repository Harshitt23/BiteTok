const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const { verifyToken, COOKIE_NAME } = require('../utils/token');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

function extractToken(req) {
    if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) return header.slice(7);
    return null;
}

/**
 * Resolves the authenticated principal (user or food partner) from the token
 * and attaches it. `req.auth = { id, role }`, plus `req.user` / `req.foodPartner`
 * for the matching role.
 */
const authenticate = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Please log in first');

    const decoded = verifyToken(token); // throws -> handled centrally
    const { id, role } = decoded;

    if (role === 'foodPartner') {
        const partner = await foodPartnerModel.findById(id);
        if (!partner) throw ApiError.unauthorized('Account no longer exists');
        req.foodPartner = partner;
    } else {
        const user = await userModel.findById(id);
        if (!user) throw ApiError.unauthorized('Account no longer exists');
        req.user = user;
    }

    req.auth = { id, role: role || 'user' };
    next();
});

/** Allows the request through only for the given role. */
const requireRole = (role) => (req, res, next) => {
    if (!req.auth || req.auth.role !== role) {
        return next(
            ApiError.forbidden(
                role === 'foodPartner'
                    ? 'Only food partners can perform this action'
                    : 'Only users can perform this action'
            )
        );
    }
    next();
};

const requireUser = [authenticate, requireRole('user')];
const requireFoodPartner = [authenticate, requireRole('foodPartner')];

/** Attaches the principal if a valid token is present, but never rejects. */
const optionalAuth = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) return next();
    try {
        const { id, role } = verifyToken(token);
        if (role === 'foodPartner') {
            req.foodPartner = await foodPartnerModel.findById(id);
        } else {
            req.user = await userModel.findById(id);
        }
        req.auth = { id, role: role || 'user' };
    } catch {
        /* ignore invalid token for optional auth */
    }
    next();
});

module.exports = {
    authenticate,
    requireRole,
    requireUser,
    requireFoodPartner,
    optionalAuth,
};
