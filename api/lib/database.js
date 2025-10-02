// Database connection for Vercel serverless functions
require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectDB, mongoose };
