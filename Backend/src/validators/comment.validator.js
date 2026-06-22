const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createCommentSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        text: z.string().trim().min(1, 'Comment cannot be empty').max(500),
    }),
});

const listCommentsSchema = z.object({
    params: z.object({ id: objectId }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(20),
    }),
});

const commentIdParamSchema = z.object({
    params: z.object({ id: objectId }),
});

module.exports = { createCommentSchema, listCommentsSchema, commentIdParamSchema };
