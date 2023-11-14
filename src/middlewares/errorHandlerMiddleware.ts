import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger/winstonLogger';
import {LoginError} from "../Errors/loginErrors";
import {JWTValidationError, NoJWTError} from "../Errors/JWTErrors";

export const errorHandlerMiddleware = function (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!(err instanceof Error)) {
        // something unexpected
        logger.error(`Unexpected instance of error. Given error type: ${typeof err}`);
        res.status(500).send('Unknown error');
        next();
    }

    logger.error(err.message);

    if (err instanceof DBInitializationError) {
        res.status(500).send(err.message);
        process.exit(1);
    } else if((err instanceof LoginError) || (err instanceof JWTValidationError)){
        res.status(401).send(err.message);
    } else if(err instanceof NoJWTError){
        res.status(403).send(err.message);
    } else if ((err instanceof FindUserError) || (err instanceof FindGroupError)) {
        res.status(404).send(err.message);
    } else {
        res.status(500).send(err.message);
    }
    next();
};

export class DBInitializationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DBInitializationError';
    }
}

export class FindUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FindUserError';
    }
}

export class FindGroupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FindGroupError';
    }
}