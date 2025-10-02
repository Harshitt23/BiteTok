// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');   
const cors = require('cors');                    


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [`https://${process.env.VERCEL_URL}`, 'https://bite-tok.vercel.app', 'https://bite-tok-git-main.vercel.app']
        : 'http://localhost:5173',
    credentials: true
}));                             

app.get("/", (req, res) => {
    res.send("Hello bro keep going");
})

app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API is running",
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// Catch-all handler for API routes (for Vercel)
app.all('/api/*', (req, res) => {
    console.log(`Requested API route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'API endpoint not found',
        requestedRoute: req.originalUrl,
        method: req.method
    });
});

module.exports = app;