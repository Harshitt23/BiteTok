// Debug endpoint to help troubleshoot
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const debugInfo = {
        message: "Debug endpoint is working!",
        timestamp: new Date().toISOString(),
        request: {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body
        },
        environment: {
            nodeVersion: process.version,
            nodeEnv: process.env.NODE_ENV || 'not set',
            hasDotenv: !!process.env.DOTENV_CONFIG_PATH,
            uriSet: !!process.env.MONGODB_URI
        }
    };

    res.status(200).json(debugInfo);
};
