const ApiError = require('../utils/ApiError');

/**
 * Validates and coerces req.body / req.params / req.query against a Zod schema.
 * On success, replaces the request parts with the parsed (typed) values.
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (!result.success) {
        const details = result.error.issues.map((i) => ({
            field: i.path.slice(1).join('.') || i.path.join('.'),
            message: i.message,
        }));
        return next(ApiError.badRequest('Validation failed', details));
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    // req.query is read-only in Express 5; only overwrite when present.
    if (result.data.query) {
        try {
            req.query = result.data.query;
        } catch {
            /* read-only in some setups — validation already passed */
        }
    }
    next();
};

module.exports = validate;
