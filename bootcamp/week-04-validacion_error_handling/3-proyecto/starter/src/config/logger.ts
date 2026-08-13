import winston, { createLogger, format, transports, type Logger } from 'winston';
import morgan, { type StreamOptions } from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';
const LOG_LEVEL = process.env['LOG_LEVEL'] ?? (isDev ? 'http' : 'warn');

const consoleFormat = isDev
  ? format.combine(
      format.colorize(),
      format.timestamp({ format: 'HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => {
        const meta = (({ timestamp: _t, level: _l, message: _m, ...rest }) => rest)(
          { timestamp, level, message, ...(typeof message === 'string' ? {} : {}) } as Record<string, unknown>,
        );
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level} ${typeof message === 'string' ? message : JSON.stringify(message)}${metaStr}`;
      }),
    )
  : format.combine(format.timestamp(), format.json());

export const logger: Logger = createLogger({
  level: LOG_LEVEL,
  format: consoleFormat,
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
    ...(isDev
      ? []
      : [
          new transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
        ]),
  ],
});

const morganStream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

const morganFormat = isDev ? 'dev' : 'combined';

export const morganMiddleware = morgan(morganFormat, { stream: morganStream });

void winston;
