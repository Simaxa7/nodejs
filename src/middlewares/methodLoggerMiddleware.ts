import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger/winstonLogger';

export const methodLoggerMiddleware = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.info(
        `request method: ${req.method}
      request params: ${JSON.stringify(req.params)}
      request body: ${JSON.stringify(req.body)}
      request query: ${JSON.stringify(req.query)}`
    );
    next();
};
