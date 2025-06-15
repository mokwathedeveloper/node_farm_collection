const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const logger = require('../utils/logger');

// Create Redis client if REDIS_URL is provided
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
  
  redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
  });
  
  redisClient.on('connect', () => {
    logger.info('Connected to Redis for rate limiting');
  });
}

/**
 * Rate limiter middleware factory
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests in the time window
 * @param {string} options.message - Error message
 * @returns {Function} Express middleware
 */
const rateLimiter = ({ max = 100, windowMs = 15 * 60 * 1000 } = {}) => {
    return rateLimit({
    windowMs,
    max,
    message: {
            error: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

module.exports = {
    rateLimiter
};
