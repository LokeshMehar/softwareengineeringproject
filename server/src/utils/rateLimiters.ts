import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
      success: false,
      message: 'Too many login attempts. Please try again later.',
      details: {
        retryAfter: '60 minutes'
      }
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
  });

  export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
      details: {
        retryAfter: '15 minutes'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });