import * as Repository from '../data-access/dataBaseAccess';
import {User} from '../models/models.User';
import {UserUpdates} from "../models/types";

export class UserService {
    public async createUser(user: User) {
        return await Repository.createUser(user);
    }

    public async getUserById(id: string) {
        return await Repository.getUserById(id);
    }

    public async updateUser(id: string, userUpdates: UserUpdates) {
        return await Repository.updateUser(id, userUpdates);
    }

    public async deleteUser(
        id: string,
        userUpdates: UserUpdates = {is_deleted: true}
    ) {
        return await Repository.updateUser(id, userUpdates);
    }

    public async getUsers(substring?: string, limit?: number) {
        const updatedLimit = limit ? +limit : undefined;
        const updatedSubstring = substring ? substring : '';
        return await Repository.getUsers(updatedLimit, updatedSubstring);
    }
}
