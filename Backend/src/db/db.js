const mongoose = require('mongoose');
const env = require('../config/env');

mongoose.set('strictQuery', true);

async function connectDB(uri = env.MONGODB_URI) {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    return mongoose.connection;
}

async function disconnectDB() {
    await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
