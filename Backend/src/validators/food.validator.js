const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createFoodSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Food name is required').max(120),
        description: z.string().trim().max(2000).optional().default(''),
    }),
});

const foodIdParamSchema = z.object({
    params: z.object({ id: objectId }),
});

const feedQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10),
    }),
});

module.exports = { createFoodSchema, foodIdParamSchema, feedQuerySchema, objectId };
