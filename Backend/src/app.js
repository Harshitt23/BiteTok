// Minimal app for testing
const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        service: 'bite-tok-backend'
    });
});

module.exports = app;