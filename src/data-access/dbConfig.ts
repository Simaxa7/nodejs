import * as dotenv from 'dotenv';
import {DataSource} from 'typeorm';
import {User} from "../models/models.User";
import {Groups} from "../models/models.Groups";

dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

const AppDataSource = new DataSource({
    type: 'postgres',
    host: DBhost,
    port: 5432,
    username,
    password: DBpassword,
    database: DBname,
    synchronize: true,
    logging: true,
    entities: [User, Groups],
    subscribers: [],
    migrations: [],
});


export default AppDataSource;