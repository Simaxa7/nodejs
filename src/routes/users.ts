import express from 'express';
import { UserService } from '../services/userService';
import { querySubstringLimitValidation } from '../services/middlewares';

const users = express.Router();
const userService = new UserService();

users.get('/users', querySubstringLimitValidation, async (req, res) => {
    const substring = req.query.login_substring as string;
    const limit = req.query.limit as string;

    const result = await userService.getUsers(limit, substring);

    if (result instanceof Error) {
        res.status(500).json({ message: result });
    } else {
        res.status(200).json({ users: result });
    }
});

export default users;
