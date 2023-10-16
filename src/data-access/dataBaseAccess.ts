import {GroupUpdates} from '../validation/types';
import AppDataSource from './dbConfig';
import {User} from "../models/models.User";
import {Groups} from "../models/models.Groups";
import {UserUpdates} from "../models/types";

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
        process.exit();
    });

export async function createUser(newUser: User) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const user = await transactionalEntityManager
                    .getRepository(User)
                    .create(newUser);
                const results = await transactionalEntityManager
                    .getRepository(User)
                    .save(user);
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function getUserById(id: string) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const results = await transactionalEntityManager
                    .getRepository(User)
                    .findOneBy({
                        id,
                    });
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function getUsers(limit?: number, substring?: string) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const results = substring
                    ? await transactionalEntityManager
                        .getRepository(User)
                        .createQueryBuilder('user')
                        .where('user.login like :login', {login: `%${substring}%`})
                        .orderBy('user.login', 'ASC')
                        .limit(limit)
                        .getMany()
                    : await transactionalEntityManager
                        .getRepository(User)
                        .createQueryBuilder('user')
                        .orderBy('user.login', 'ASC')
                        .limit(limit)
                        .getMany();

                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function updateUser(id: string, userUpdates: UserUpdates) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                let results = await transactionalEntityManager
                    .getRepository(User)
                    .findOneBy({
                        id,
                    });
                if (results) {
                    await transactionalEntityManager
                        .getRepository(User)
                        .merge(results, userUpdates);
                    results = await transactionalEntityManager
                        .getRepository(User)
                        .save(results);
                }
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function createGroup(newGroup: Groups) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const group = transactionalEntityManager
                    .getRepository(Groups)
                    .create(newGroup);
                const results = await transactionalEntityManager
                    .getRepository(Groups)
                    .save(group);
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function getGroupById(id: string) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const results = await transactionalEntityManager
                    .getRepository(Groups)
                    .findOneBy({
                        id,
                    });
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function getGroups() {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const results = await transactionalEntityManager
                    .getRepository(Groups)
                    .createQueryBuilder('group')
                    .orderBy('group.name', 'ASC')
                    .getMany();
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function updateGroup(id: string, groupUpdates: GroupUpdates) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                let results = await transactionalEntityManager
                    .getRepository(Groups)
                    .findOneBy({
                        id,
                    });
                if (results) {
                    await transactionalEntityManager
                        .getRepository(Groups)
                        .merge(results, groupUpdates);
                    results = await transactionalEntityManager
                        .getRepository(Groups)
                        .save(results);
                }
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function deleteGroup(id: string) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const results = await transactionalEntityManager
                    .getRepository(Groups)
                    .findOneBy({
                        id,
                    });
                if (results) {
                    await transactionalEntityManager.getRepository(Groups).remove(results);
                }
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function addUsersToGroup(groupId: string, userIds: string[]) {
    try {
        const res = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                let results;
                const arrOfPromises = userIds.map(async (id) => {
                    const user: User | null = await transactionalEntityManager
                        .getRepository(User)
                        .findOneBy({
                            id,
                        });

                    return user;
                });
                const users: Array<User | null> = await Promise.all(arrOfPromises);
                const filteredUsers = users.filter((user) => !!user) as User[];

                const group: Groups | null = await transactionalEntityManager
                    .getRepository(Groups)
                    .findOneBy({
                        id: groupId,
                    });
                if (group) {
                    const mergeResult = transactionalEntityManager
                        .getRepository(Groups)
                        .merge(group, {users: filteredUsers});
                    results = await transactionalEntityManager
                        .getRepository(Groups)
                        .save(mergeResult);
                }
                return results;
            }
        );
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}