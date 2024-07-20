import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import Transport from 'winston-transport';
import { envLoaded, envFilePath } from './loadEnv';

const Colors: any = {
  info: '\x1b[36m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  verbose: '\x1b[43m',
  http: '\x1b[35m',
  debug: '\x1b[32m',
  silly: '\x1b[34m',
  msg: '\x1b[37m',
};

interface LogInfo {
  level: string;
  message: string;
  stack?: string;
}

class SimpleConsoleTransport extends Transport {
  constructor(config: object) {
    super(config);
  }

  override log = (info: LogInfo, callback: Function) => {
    const { level, message, stack } = info;
    // get the current local time in the format HH:MM:SS (24-hour clock)
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    // get the current date in the format YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];
    console.log(
      `${Colors[level]}${level.toUpperCase()} -- [${date}@${time}]:   \t${Colors.msg}${message}\x1b[0m`,
      stack ? '\n' + stack : '',
    );
    if (callback) {
      callback();
    }
  };
}


// Log directory path
const LOG_DIR = path.join(__dirname, '../..', 'logs');

// Constants for log filenames
const epoch = Date.now(); // epoch at time of import
const envSuffix = process.env['NODE_ENV'] === 'dev' ? `_${epoch}` : '';
const COMBINED_LOG_FILENAME = path.join(LOG_DIR, `combined${envSuffix}.log`);
const FULL_LOG_FILENAME = path.join(LOG_DIR, `full${envSuffix}.log`);

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Determine log level from environment variable or default to 'info'
const logLevel = process.env['LOG_LEVEL'] || 'info';

// Create the logger configuration
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: FULL_LOG_FILENAME, level: 'debug' }),
    new winston.transports.File({ filename: COMBINED_LOG_FILENAME }),
  ],
});

if (process.env['NODE_ENV'] !== 'production') {
  logger.add(new SimpleConsoleTransport({ format: winston.format.simple(), level: logLevel }));
}

if (!envLoaded) {
  logger.warn(`Environment file not found at ${envFilePath}`);
  logger.warn('Using default environment variables');
} else {
  logger.info(`Environment file loaded from ${envFilePath}`);
}

export default logger;