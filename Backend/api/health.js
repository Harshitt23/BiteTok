require('dotenv').config();

module.exports = async (req, res) => {
    res.status(200).json({
        message: "Health check successful",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        hasMongoDB: !!process.env.MONGODB_URI
    });
};