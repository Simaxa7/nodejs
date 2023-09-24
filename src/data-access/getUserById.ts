import Model from 'sequelize/types/model';
import DataBaseAccess from './dataBaseAccess'
export default async function getUserById(id: string) {
    try {
        const db = new DataBaseAccess();
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const user: Model | null = await db.UserModel.findByPk(id);
        console.log(user?.toJSON());
        await db.sequelize.close();
        return user;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error;
    }
}
