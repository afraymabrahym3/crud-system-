const rateLimit = require('express-rate-limit');

// Limit auth requests
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth routes
    message: 'Too many login attempts, please try again after 15 minutes'
});

// Limit API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs for other routes
});

module.exports = { authLimiter, apiLimiter }; 