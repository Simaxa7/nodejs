import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWTValidationError, NoJWTError } from '../Errors/JWTErrors';

export const checkTokenMiddleware = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(req.path === '/user/login') return next()

    const token = typeof req.headers['jwt-access-token'] === 'string' ? req.headers['jwt-access-token'] : undefined ;

    if (token) {
        const secret = process.env.SECRET as string;
        jwt.verify(token, secret, function (err) {
            if (err) throw new JWTValidationError('Failed jwt token');
            next();
        });
    } else {
        throw new NoJWTError('No jwt token provided');
    }
};
