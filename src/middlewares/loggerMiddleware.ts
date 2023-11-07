import morgan from 'morgan';
import { logger } from '../logger/winstonLogger';

const stream = {
    write: (message: string) => logger.http(message),
};

export const loggerMiddleware = morgan(
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
    { stream }
);
