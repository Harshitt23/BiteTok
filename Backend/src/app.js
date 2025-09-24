// create server
const express = require('express');


const app = express();


app.get("/", (req, res) => {
    res.send("Hello bro keep going");
})

module.exports = app;