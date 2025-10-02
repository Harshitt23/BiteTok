// Test API endpoint in pages directory
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'API works from pages directory!',
    working: true,
    timestamp: new Date().toISOString()
  });
};
