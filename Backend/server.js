// start server
require('dotenv').config();
const app = require('./src/app');

// Export app for Vercel, fallback to normal server for local development
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    // For Vercel deployment
    module.exports = app;
} else {
    // For local development
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}
