import DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

const transports = [];
const DEFAULT_LOG_LEVEL = 'info';

transports.push(new DailyRotateFile({
    filename: '/var/log/appNameBackend/application-%DATE%.log',
    datePattern: 'MM-DD-YYYY',
    zippedArchive: true,
    handleExceptions: true,
    maxSize: '20m'
  })
);

const loggerInstance = winston.createLogger({
  level: process.env['LOG_LEVEL'] || DEFAULT_LOG_LEVEL,
  levels: winston.config.npm.levels,
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

export default loggerInstance;

