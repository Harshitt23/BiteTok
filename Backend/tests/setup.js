// Set required env BEFORE any app module (which validates env on import) loads.
// dotenv does not override already-set vars, so these win over Backend/.env.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_at_least_16_chars_long';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGODB_URI = 'mongodb://placeholder:27017/test';
process.env.CORS_ORIGIN = '*';
process.env.IMAGEKIT_PUBLIC_KEY = 'test_public';
process.env.IMAGEKIT_PRIVATE_KEY = 'test_private';
process.env.IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/test';

const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, disconnectDB } = require('../src/db/db');
const mongoose = require('mongoose');

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDB(mongod.getUri());
});

afterEach(async () => {
    const { collections } = mongoose.connection;
    await Promise.all(
        Object.values(collections).map((c) => c.deleteMany({}))
    );
});

afterAll(async () => {
    await disconnectDB();
    if (mongod) await mongod.stop();
});
