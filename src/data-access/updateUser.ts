import Model from 'sequelize/types/model';
import DataBaseAccess from './dataBaseAccess';
import { UserUpdates } from '../models/types';

export default async function updateUser(
    id: string,
    userUpdates: UserUpdates,
) {
    try {
        const db = new DataBaseAccess();
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const user: Model | null = await db.UserModel.findByPk(id);
        let updatedUser: Model | null = null;
        if (user) {
            user.set(userUpdates);
            updatedUser = await user.save();
        }
        await db.sequelize.close();
        return updatedUser;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error;
    }
}
