const rateLimit = require("express-rate-limit");

const createLimiter = ({
    windowMs,
    limit,
    message,
    skipSuccessfulRequests = false
}) => {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,

        handler: (req, res) => {
            return res.status(429).json({
                success: false,
                message,
                retryAfterSeconds:
                    res.getHeader("Retry-After") || null
            });
        }
    });
};

// Registration: maximum 10 requests per hour per IP.
const registerLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: "Too many registration attempts. Please try again later."
});

// Login: maximum 10 unsuccessful requests per 15 minutes per IP.
// Successful requests are excluded from the final count.
const loginLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    message:
        "Too many login attempts. Please wait 15 minutes before trying again."
});

// Password reset: maximum 5 requests per hour per IP.
const forgotPasswordLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message:
        "Too many password reset requests. Please try again later."
});

// Booking endpoints: maximum 30 requests per minute per IP.
const bookingLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 30,
    message:
        "Too many booking requests. Please slow down and try again shortly."
});

module.exports = {
    registerLimiter,
    loginLimiter,
    forgotPasswordLimiter,
    bookingLimiter
};
