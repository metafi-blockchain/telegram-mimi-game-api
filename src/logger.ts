// logger.ts
import * as winston from 'winston';

const pathLog = 'logs';
export const winstonLoggerOptions = {
  transports: [
    // Console Transport for all log levels
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),

    // Info-level logs to a separate file
    new winston.transports.File({
      filename: `${pathLog}/info.log`,
      level: 'info',  // Only logs at 'info' level and higher
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Log in JSON format
      ),
    }),

    // Error-level logs to a separate file
    new winston.transports.File({
      filename: `${pathLog}/error.log`,
      level: 'error',  // Only logs at 'error' level and higher
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    // Debug-level logs to a separate file
    new winston.transports.File({
      filename: `${pathLog}/debug.log`,
      level: 'debug',  // Only logs at 'debug' level and higher
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
};