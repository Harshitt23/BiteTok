const env = require('./src/config/env');
const createApp = require('./src/app');
const { connectDB } = require('./src/db/db');

async function start() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        const app = createApp();
        const server = app.listen(env.PORT, () => {
            console.log(`🚀 BiteTok API running on port ${env.PORT} [${env.NODE_ENV}]`);
        });

        const shutdown = (signal) => {
            console.log(`\n${signal} received, shutting down gracefully...`);
            server.close(() => process.exit(0));
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

start();
