const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport for all environments
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // File transport for production
    ...(process.env.NODE_ENV === 'production' 
      ? [
          // Error logs
          new transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
          }),
          // Combined logs
          new transports.File({ 
            filename: 'logs/combined.log' 
          }),
        ] 
      : []),
  ],
});

module.exports = logger;