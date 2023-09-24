import { Op } from 'sequelize';
import Model from 'sequelize/types/model';
import DataBaseAccess from './dataBaseAccess';
export default async function getUsers(
    limit: number | undefined,
    substring: string
) {
    try {
        const db = new DataBaseAccess();
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const users: Model[] = await db.UserModel.findAll({
            where: {
                login: {
                    [Op.iLike]: `%${substring}%`
                }
            },
            limit,
            order: [['login', 'ASC']],
        });
        console.log(JSON.stringify(users, null, 2));
        await db.sequelize.close();
        return users;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error;
    }
}
