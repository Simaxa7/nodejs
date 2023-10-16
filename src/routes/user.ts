import express, {Response} from 'express';
import {UserService} from '../services/userService';
import {
    userBodyValidatorOnCreate,
    userBodyValidatorOnUpdate,
    paramsIdValidator,
    userQuerySubstringLimitValidator,
} from '../validation/validators';
import {User} from '../models/models.User';
import {ValidatedRequest} from 'express-joi-validation';
import {
    CreateUserBodySchema,
    ParamsIDSchema,
    QuerySubstringLimitSchema,
    UpdateUserBodySchema,
} from '../validation/types';

const user = express.Router();
const userService = new UserService();

user.post(
    '/user',
    userBodyValidatorOnCreate,
    async (req: ValidatedRequest<CreateUserBodySchema>, res: Response) => {
        try {
            const user: User = {...req.body};
            const result = await userService.createUser(user);
            res.status(200).json({createdUser: result});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

user.get(
    '/user/:id',
    paramsIdValidator,
    async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
        try {
            const {id} = req.params;
            const result = await userService.getUserById(id);
            result
                ? res.status(200).json({user: result})
                : res.status(404).json({message: `no users with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

user.put(
    '/user/:id',
    userBodyValidatorOnUpdate,
    paramsIdValidator,
    async (
        req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
        res: Response
    ) => {
        try {
            const {id} = req.params;
            const result = await userService.updateUser(id, req.body);
            result
                ? res.status(200).json({updatedUser: result})
                : res.status(404).json({message: `no users with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

user.delete(
    '/user/:id',
    paramsIdValidator,
    async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
        try {
            const {id} = req.params;
            const result = await userService.deleteUser(id);
            result
                ? res
                    .status(200)
                    .json({message: `user with id ${id} marked as deleted`})
                : res.status(404).json({message: `no users with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

user.get(
    '/users',
    userQuerySubstringLimitValidator,
    async (req: ValidatedRequest<QuerySubstringLimitSchema>, res: Response) => {
        try {
            const {loginsubstring} = req.query;
            const {limit} = req.query;

            const result = await userService.getUsers(loginsubstring, limit);
            res.status(200).json({users: result});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

export default user;