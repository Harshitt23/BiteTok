const { z } = require('zod');

// Load .env as early as possible.
require('dotenv').config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),

    // Comma-separated list of allowed origins. "*" allows all (dev only).
    CORS_ORIGIN: z.string().default('http://localhost:5173'),

    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    JWT_SECRET: z
        .string()
        .min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),

    IMAGEKIT_PUBLIC_KEY: z.string().min(1, 'IMAGEKIT_PUBLIC_KEY is required'),
    IMAGEKIT_PRIVATE_KEY: z.string().min(1, 'IMAGEKIT_PRIVATE_KEY is required'),
    IMAGEKIT_URL_ENDPOINT: z.string().url('IMAGEKIT_URL_ENDPOINT must be a valid URL'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n');
    // Fail fast: a misconfigured server should never start.
    console.error('❌ Invalid environment configuration:\n' + issues);
    process.exit(1);
}

const env = parsed.data;

const corsOrigins =
    env.CORS_ORIGIN === '*'
        ? '*'
        : env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);

module.exports = {
    ...env,
    corsOrigins,
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
};
