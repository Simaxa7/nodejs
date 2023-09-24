import express from 'express';
import { UserService } from '../services/userService';
import {
    createUserBodyValidation,
    paramsIdValidation,
    updateUserBodyValidation,
} from '../services/middlewares';
import { User } from '../models/types';

const user = express.Router();
const userService = new UserService();

user.post('/user', createUserBodyValidation, async (req, res) => {
    const user: User = { ...req.body };
    const result = await userService.createUser(user);
    if (result instanceof Error) {
        res.status(500).json({ message: result });
    } else {
        res.status(200).json({ createdUser: result });
    }
});

user.get('/user/:id', paramsIdValidation, async (req, res) => {
    const { id } = req.params;
    const result = await userService.getUserById(id);
    if (result instanceof Error) {
        res.status(500).json({ message: result });
    } else {
        result
            ? res.status(200).json({ user: result })
            : res.status(404).json({ message: `no users with id ${id}` });
    }
});

user.put(
    '/user/:id',
    updateUserBodyValidation,
    paramsIdValidation,
    async (req, res) => {
        const { id } = req.params;
        const result = await userService.updateUser(id, req.body);
        if (result instanceof Error) {
            res.status(500).json({ message: result });
        } else {
            result
                ? res.status(200).json({ updatedUser: result })
                : res.status(404).json({ message: `no users with id ${id}` });
        }
    }
);

user.delete('/user/:id', paramsIdValidation, async (req, res) => {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    if (result instanceof Error) {
        res.status(500).json({ message: result });
    } else {
        result
            ? res
                .status(200)
                .json({ message: `user with id ${id} marked as deleted` })
            : res.status(404).json({ message: `no users with id ${id}` });
    }
});

export default user;
