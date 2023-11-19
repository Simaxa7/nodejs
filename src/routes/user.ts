import express, {Response, NextFunction} from 'express';
import {ValidatedRequest} from 'express-joi-validation';
import * as jwt from 'jsonwebtoken';

import {UserService} from '../services/userService';
import {
    userBodyValidatorOnCreate,
    userBodyValidatorOnUpdate,
    paramsIdValidator,
    userQuerySubstringLimitValidator,
    userBodyCredentialsValidator,
} from '../validation/validators';
import {User} from '../models/models.User';
import {
    CreateUserBodySchema,
    ParamsIDSchema,
    QuerySubstringLimitSchema,
    UpdateUserBodySchema,
    GetUserByCredentialsBodySchema,
} from '../validation/types';
import {methodLoggerMiddleware} from '../middlewares/methodLoggerMiddleware';
import {LoginError} from '../Errors/loginErrors';

export  function createUserRouter(userService:UserService) {
    const user = express.Router();

    user.post(
        '/user',
        userBodyValidatorOnCreate,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<CreateUserBodySchema>, res: Response, next: NextFunction) => {
            try {
                const user: User = {...req.body};
                const result = await userService.createUser(user);
                res.status(200).json({createdUser: result});
            } catch (e) {
                next(e);
            }
        }
    );

    user.get(
        '/user/:id',
        paramsIdValidator,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<ParamsIDSchema>, res: Response, next: NextFunction) => {
            try {
                const {id} = req.params;
                const result = await userService.getUserById(id);
                result
                    ? res.status(200).json({user: result})
                    : res.status(404).json({message: `no users with id ${id}`});
            } catch (e) {
                next(e);
            }
        }
    );

    user.put(
        '/user/:id',
        userBodyValidatorOnUpdate,
        paramsIdValidator,
        methodLoggerMiddleware,
        async (
            req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {id} = req.params;
                const result = await userService.updateUser(id, req.body);
                result
                    ? res.status(200).json({updatedUser: result})
                    : res.status(404).json({message: `no users with id ${id}`});
            } catch (e) {
                next(e);
            }
        }
    );

    user.delete(
        '/user/:id',
        paramsIdValidator,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<ParamsIDSchema>, res: Response, next: NextFunction) => {
            try {
                const {id} = req.params;
                const result = await userService.deleteUser(id);
                result
                    ? res
                        .status(200)
                        .json({message: `user with id ${id} marked as deleted`})
                    : res.status(404).json({message: `no users with id ${id}`});
            } catch (e) {
                next(e);
            }
        }
    );

    user.get(
        '/users',
        userQuerySubstringLimitValidator,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<QuerySubstringLimitSchema>, res: Response, next: NextFunction) => {
            try {
                const {loginsubstring} = req.query;
                const {limit} = req.query;

                const result = await userService.getUsers(loginsubstring, limit);
                res.status(200).json({users: result});
            } catch (e) {
                next(e);
            }
        }
    );

    user.get('/error1', methodLoggerMiddleware, function () {
        throw new Error("Test Error1 I AM UNHANDLED EXEPTION");
    });

    user.get('/error2', methodLoggerMiddleware, function () {
        new Promise((res, rej) => {
            rej('Test Error2 I AM UNHANDLED PROMISE REJECTION')
        })
    });

    user.post(
        '/user/login',
        userBodyCredentialsValidator,
        async (
            req: ValidatedRequest<GetUserByCredentialsBodySchema>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {login, password} = req.body;

                const result = await userService.getUserByCredentials(login, password);

                if (result instanceof User) {
                    const payload = {sub: 'api access', userId: result.id};
                    const secret = process.env.SECRET as string;
                    const token = jwt.sign(payload, secret, {expiresIn: `${process.env.EXPIRESIN}ms`});
                    res.status(200).json({token});
                } else {
                    throw new LoginError('Bad Username/Password combination')
                }
            } catch (e) {
                next(e);
            }
        }
    );

    return user;
}