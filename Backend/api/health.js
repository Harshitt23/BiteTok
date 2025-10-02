// Health check endpoint
module.exports = async (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "bite-tok-backend",
        timestamp: new Date().toISOString()
    });
};
