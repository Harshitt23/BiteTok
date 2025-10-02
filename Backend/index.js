// Ultra simple function for debugging
module.exports = async (req, res) => {
    res.status(200).json({ 
        message: "WORKING!", 
        timestamp: Date.now() 
    });
};
