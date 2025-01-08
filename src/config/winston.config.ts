// src/config/winston.config.ts
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const transports = [];

if (process.env.CREATE_LOG_FILE === 'true') {
  transports.push(
    new winston.transports.DailyRotateFile({
      level: process.env.LOG_LEVEL || 'info',
      filename: path.join(process.env.LOG_FILE_PATH || './public/logs', 'api_astro_tickets-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

if (process.env.PRINT_TO_CONSOLE === 'true') {
  transports.push(
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

if (transports.length === 0) {
  transports.push(
    new winston.transports.Console({
      level: 'silent',
    })
  );
}

export const winstonConfig = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports,
};