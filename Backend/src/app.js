// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');                           //by -- cursor


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));                               //by -- cursor

app.get("/", (req, res) => {
    res.send("Hello bro keep going");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);                                             //by -- cursor

module.exports = app;