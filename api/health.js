// Health check endpoint
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: "OK",
        message: "API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
};
