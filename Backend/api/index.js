// Minimal Vercel serverless function
module.exports = async (req, res) => {
    res.status(200).json({
        message: "Backend API is working!",
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
    });
};
