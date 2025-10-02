// Add environment variables first
require('dotenv').config();

// Add MongoDB connection
const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        await connectDB();
        res.json({ 
            message: "Backend API is working!", 
            timestamp: Date.now(),
            database: "Connected"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Database connection failed",
            error: error.message 
        });
    }
});

module.exports = app;
