import DataBaseAccess from './dataBaseAccess'
import { User } from '../models/types';

export default async function createUser({login, password, age, is_deleted}: User) {
    try {
        const db= new DataBaseAccess();
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const user = await db.UserModel.create({ login, password, age, is_deleted });
        console.log(user?.toJSON());
        await db.sequelize.close();
        return user;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error;
    }
}
