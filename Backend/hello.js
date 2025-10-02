module.exports = async (req, res) => {
    res.status(200).json({ 
        message: "Hello World!",
        working: true,
        timestamp: new Date().toISOString()
    });
};
