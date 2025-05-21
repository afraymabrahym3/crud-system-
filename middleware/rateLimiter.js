const rateLimit = require('express-rate-limit');

// Create auth limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Create API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    apiLimiter
}; 