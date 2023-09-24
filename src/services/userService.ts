import createUser from '../data-access/createUser';
import getUserById from '../data-access/getUserById';
import getUsers from '../data-access/getUsers';
import updateUser from '../data-access/updateUser';
import {User, UserUpdates} from '../models/types';

export class UserService {
    public async createUser(user: User) {
        return await createUser(user);
    }

    public async getUserById(id: string) {
        return await getUserById(id);
    }

    public async updateUser(id: string, userUpdates: UserUpdates) {
        return await updateUser(id, userUpdates);
    }

    public async deleteUser(
        id: string,
        userUpdates: UserUpdates = { is_deleted: true }
    ) {
        return await updateUser(id, userUpdates);
    }

    public async getUsers(
        limit: string | undefined,
        substring: string | undefined
    ) {
        const updatedLimit = limit ? +limit : undefined;
        const updatedSubstring = substring ? substring : '';
        return await getUsers(updatedLimit, updatedSubstring);
    }
}
