import express, {Response} from 'express';
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

const group = express.Router();
const groupService = new GroupService();

// http://localhost:3000/group
// body:
// {
//     "name": "Admin1",
//     "permissions": ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"]
// }
group.post(
    '/group',
    groupBodyValidatorOnCreate,
    async (req: ValidatedRequest<CreateGroupBodySchema>, res: Response) => {
        try {
            const group: Groups = {...req.body};
            const result = await groupService.createGroup(group);
            res.status(200).json({createdGroup: result});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

// http://localhost:3000/group/42125ce7-9cd2-455c-965e-24aa57cfbc07
group.get(
    '/group/:id',
    paramsIdValidator,
    async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
        try {
            const {id} = req.params;
            const result = await groupService.getGroupById(id);
            result
                ? res.status(200).json({group: result})
                : res.status(404).json({message: `no groups with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

// http://localhost:3000/groups
group.get('/groups', async (req, res) => {
    try {
        const result = await groupService.getGroups();
        res.status(200).json({groups: result});
    } catch (e) {
        res
            .status(500)
            .json({message: e instanceof Error ? e.message : 'Unknown Error'});
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
    async (
        req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
        res: Response
    ) => {
        try {
            const {id} = req.params;
            const result = await groupService.updateGroup(id, req.body);
            result
                ? res.status(200).json({updatedGroup: result})
                : res.status(404).json({message: `no groups with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

// http://localhost:3000/group/42125ce7-9cd2-455c-965e-24aa57cfbc07
group.delete(
    '/group/:id',
    paramsIdValidator,
    async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
        try {
            const {id} = req.params;
            const result = await groupService.deleteGroup(id);
            result
                ? res.status(200).json({message: `group with id ${id} deleted`})
                : res.status(404).json({message: `no groups with id ${id}`});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
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
    async (
        req: ValidatedRequest<ParamsIDSchema & CreateGroupRelationsBodySchema>,
        res: Response
    ) => {
        try {
            const {id} = req.params;
            const userIds: string[] = [...req.body.usersId];
            const result = await groupService.addUsersToGroup(id, userIds);
            res.status(200).json({createdGroupRelations: result});
        } catch (e) {
            res
                .status(500)
                .json({message: e instanceof Error ? e.message : 'Unknown Error'});
        }
    }
);

export default group;