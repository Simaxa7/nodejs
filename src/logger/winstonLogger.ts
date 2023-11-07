const winston = require('winston');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'white',
});

export const logger = winston.createLogger({
    level: 'debug',
    levels,
    format:
        winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.colorize({ all: true }),
        winston.format.printf((info:any) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [new winston.transports.Console()],
})
