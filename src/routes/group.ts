import express, {Response, NextFunction} from 'express';
import {GroupService} from '../services/groupService';
import {
    groupBodyValidatorOnCreate,
    groupBodyValidatorOnUpdate,
    groupRelationsBodyValidator,
    paramsIdValidator,
} from '../validation/validators';
import {Groups} from '../models/models.Groups';
import {ValidatedRequest} from 'express-joi-validation';
import {
    CreateGroupBodySchema,
    CreateGroupRelationsBodySchema,
    ParamsIDSchema,
    UpdateUserBodySchema,
} from '../validation/types';
import { methodLoggerMiddleware } from '../middlewares/methodLoggerMiddleware';

export  function createGroupRouter(groupService:GroupService){
    const group = express.Router();

    // http://localhost:3000/group
    // body:
    // {
    //     "name": "Admin1",
    //     "permissions": ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"]
    // }
    group.post(
        '/group',
        groupBodyValidatorOnCreate,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<CreateGroupBodySchema>,
               res: Response,
               next: NextFunction) => {
            try {
                const group: Groups = {...req.body};
                const result = await groupService.createGroup(group);
                res.status(200).json({createdGroup: result});
            } catch (e) {
                next(e);
            }
        }
    );

    // http://localhost:3000/group/42125ce7-9cd2-455c-965e-24aa57cfbc07
    group.get(
        '/group/:id',
        paramsIdValidator,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<ParamsIDSchema>,
               res: Response,
               next: NextFunction) => {
            try {
                const {id} = req.params;
                const result = await groupService.getGroupById(id);
                res.status(200).json({group: result});
            } catch (e) {
                next(e);
            }
        }
    );

    // http://localhost:3000/groups
    group.get(
        '/groups',
        methodLoggerMiddleware,
        async (req, res, next: NextFunction) => {
        try {
            const result = await groupService.getGroups();
            res.status(200).json({groups: result});
        } catch (e) {
            next(e);
        }
    });

    // http://localhost:3000/group/42125ce7-9cd2-455c-965e-24aa57cfbc07
    // body:
    // {
    //     "permissions": ["READ"]
    // }
    group.put(
        '/group/:id',
        groupBodyValidatorOnUpdate,
        paramsIdValidator,
        methodLoggerMiddleware,
        async (
            req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {id} = req.params;
                const result = await groupService.updateGroup(id, req.body);
                res.status(200).json({updatedGroup: result});
            } catch (e) {
                next(e);
            }
        }
    );

    // http://localhost:3000/group/42125ce7-9cd2-455c-965e-24aa57cfbc07
    group.delete(
        '/group/:id',
        paramsIdValidator,
        methodLoggerMiddleware,
        async (req: ValidatedRequest<ParamsIDSchema>, res: Response, next: NextFunction) => {
            try {
                const {id} = req.params;
                groupService.deleteGroup(id);
                res.status(200).json({message: `group with id ${id} deleted`});
            } catch (e) {
                next(e);
            }
        }
    );

    // http://localhost:3000/group/d1f77578-a70e-44e0-bd91-5b063b171894/addusers
    // body:
    // {
    //     "usersId": ["df9b0faf-ac0f-4c8e-bb06-57ef40c472d0"]
    // }
    group.post(
        '/group/:id/addusers',
        paramsIdValidator,
        groupRelationsBodyValidator,
        methodLoggerMiddleware,
        async (
            req: ValidatedRequest<ParamsIDSchema & CreateGroupRelationsBodySchema>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {id} = req.params;
                const userIds: string[] = [...req.body.usersId];
                const result = await groupService.addUsersToGroup(id, userIds);
                res.status(200).json({createdGroupRelations: result});
            } catch (e) {
                next(e);
            }
        }
    );

    return group;
}