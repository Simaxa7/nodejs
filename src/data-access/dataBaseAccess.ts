import { Sequelize, DataTypes} from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

export default class DataBaseAccess{
    public sequelize = new Sequelize(DBname, username, DBpassword, {
        host: DBhost,
        dialect: 'postgres',
    });

    public UserModel = this.sequelize.define(
        'user',
        {
            // Model attributes are defined here
            login: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false },
        },
        {
            tableName: 'users',
            timestamps: false,
        }
    );
}
