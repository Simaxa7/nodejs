import AppDataSource from './dbConfig';
import {GroupUpdates} from '../validation/types';
import {User} from "../models/models.User";
import {Groups} from "../models/models.Groups";
import {UserUpdates} from "../models/types";
import {logger} from '../logger/winstonLogger';
import {DBInitializationError, FindGroupError, FindUserError} from '../middlewares/errorHandlerMiddleware';


AppDataSource.initialize()
    .then(() => {
        logger.info('Data Source has been initialized!');
    })
    .catch(() => {
        throw new DBInitializationError('initialize faled');
    });

export async function createUser(newUser: User) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            const user = await transactionalEntityManager
                .getRepository(User)
                .create(newUser);
            return await transactionalEntityManager
                .getRepository(User)
                .save(user);
        }
    );
}

export async function getUserById(id: string) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            const results = await transactionalEntityManager
                .getRepository(User)
                .findOneBy({
                    id,
                });
            if (!results) throw new FindUserError(`no user with id: ${id}`)
            return results;
        }
    );
}

export async function getUsers(limit?: number, substring?: string) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            return substring
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
        }
    );
}

export async function updateUser(id: string, userUpdates: UserUpdates) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            let results = await transactionalEntityManager
                .getRepository(User)
                .findOneBy({
                    id,
                });

            if (!results) throw new FindUserError(`no user with id: ${id}`);

            await transactionalEntityManager
                .getRepository(User)
                .merge(results, userUpdates);
            results = await transactionalEntityManager
                .getRepository(User)
                .save(results);
            return results;
        }
    );
}

export async function createGroup(newGroup: Groups) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            const group = transactionalEntityManager
                .getRepository(Groups)
                .create(newGroup);
            return await transactionalEntityManager
                .getRepository(Groups)
                .save(group);
        }
    );
}

export async function getGroupById(id: string) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            const results = await transactionalEntityManager
                .getRepository(Groups)
                .findOneBy({
                    id,
                });

            if (!results) throw new FindGroupError(`no group with id: ${id}`);

            return results;
        }
    );
}

export async function getGroups() {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            return await transactionalEntityManager
                .getRepository(Groups)
                .createQueryBuilder('group')
                .orderBy('group.name', 'ASC')
                .getMany();
        }
    );
}

export async function updateGroup(id: string, groupUpdates: GroupUpdates) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            let results = await transactionalEntityManager
                .getRepository(Groups)
                .findOneBy({
                    id,
                });

            if (!results) throw new FindGroupError(`no group with id: ${id}`);

            await transactionalEntityManager
                .getRepository(Groups)
                .merge(results, groupUpdates);
            results = await transactionalEntityManager
                .getRepository(Groups)
                .save(results);

            return results;
        }
    );
}

export async function deleteGroup(id: string) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            const results = await transactionalEntityManager
                .getRepository(Groups)
                .findOneBy({
                    id,
                });

            if (!results) throw new FindGroupError(`no group with id: ${id}`);

            await transactionalEntityManager.getRepository(Groups).remove(results);

            return results;
        }
    );
}

export async function addUsersToGroup(groupId: string, userIds: string[]) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            let results;
            const arrOfPromises = userIds.map(async (id) => {
                const user: User | null = await transactionalEntityManager
                    .getRepository(User)
                    .findOneBy({
                        id,
                    });

                if (!user) throw new FindUserError(`no user with id: ${id}`);

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
            } else {
                throw new FindGroupError(`1111no group with id: ${groupId}`);
            }
            return results;
        }
    );
}

export async function getUserByCredentials(login: string, password: string) {
    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
            return await transactionalEntityManager
                .getRepository(User)
                .createQueryBuilder('user')
                .where('user.login = :login', {login})
                .andWhere('user.password = :password', {password})
                .andWhere('user.is_deleted = :is_deleted', {is_deleted: false})
                .getOne();
        }
    );
}
