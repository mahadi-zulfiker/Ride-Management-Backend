import winston from 'winston';

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Use console transport in production
    new winston.transports.Console(),
    // File transport only in development
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.File({ filename: 'logs/combined.log' })]
      : [])
  ]
});

export { logger };