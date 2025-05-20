// middlewares/rateLimit.js

import rateLimit from 'express-rate-limit';

// Define the rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});
