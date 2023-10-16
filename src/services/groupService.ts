import * as Repository from '../data-access/dataBaseAccess';
import {Groups} from '../models/models.Groups';
import {GroupUpdates} from "../validation/types";

export class GroupService {
    public async createGroup(group: Groups) {
        const result = await Repository.createGroup(group);
        return result;
    }

    public async getGroupById(id: string) {
        return await Repository.getGroupById(id);
    }

    public async updateGroup(id: string, groupUpdates: GroupUpdates) {
        return await Repository.updateGroup(id, groupUpdates);
    }

    public async deleteGroup(id: string) {
        return await Repository.deleteGroup(id);
    }

    public async getGroups() {
        return await Repository.getGroups();
    }

    public async addUsersToGroup(groupId: string, userIds: string[]) {
        return await Repository.addUsersToGroup(groupId, userIds);
    }
}