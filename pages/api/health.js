// Health check endpoint
module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Health check successful',
    timestamp: new Date().toISOString()
  });
};
