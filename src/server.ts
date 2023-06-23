import express from 'express';
import { randomUUID } from 'crypto';
import { User } from "./types";
import { createValidator } from 'express-joi-validation';
import {schemaId, createUserBodySchema, paramsSubstringLimitSchema} from "./schema";
// import bodyParser from 'body-parser';

const app = express();

const users: User[] = [
    {
        id: randomUUID(),
        login: 'login_string',
        password: 'password_string',
        age: 10,
        isDeleted: false,
    },
    {
        id: '5675b6c4-b2cb-45bf-b309-87f4664a76cb',
        login: 'log_str',
        password: 'password_string',
        age: 10,
        isDeleted: false,
    }
];
const validator = createValidator();

app.use(express.json());

// get user by id
// Postman:
// GET  http://localhost:3000/user/5675b6c4-b2cb-45bf-b309-87f4664a76cb
app.get('/user/:id', validator.params(schemaId),(req, res) => {
    const filteredUsers = users.filter((user) => user.id === req.params.id);
    console.log('filteredUsers:', filteredUsers);
    console.log('users:', users);
    if (filteredUsers.length) {
        res.status(200).json({ users: filteredUsers });
    } else {
        res.status(404).json({ message: `no user with id ${req.params.id}` });
    }
});

// create user
// Postman:
// POST http://localhost:3000/user
// body: { "login": "login123", "password": "password1", "age": "10", "isDeleted": "false" }
app.post('/user', validator.body(createUserBodySchema), (req, res) => {
    const user = { ...req.body, id: randomUUID() };
    users.push(user);
    res.status(200).json({ created_user: user });
});

// get all users
// Postman:
// GET  http://localhost:3000/userList
app.get('/userList', (req, res) => {
    res.status(200).json({ users });
});

//delete user
// Postman:
// DELETE  http://localhost:3000/user/5675b6c4-b2cb-45bf-b309-87f4664a76cb
app.delete('/user/:id', validator.params(schemaId), (req, res) => {
    const index = users.findIndex((user) => user.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: `no user with id ${req.params.id}` });
    } else {
        users[index] = { ...users[index], isDeleted: true };
        res
            .status(200)
            .json({ message: `user with id ${req.params.id} marked as deleted` });
    }
});

// filter users on limit
// Postman:
// GET http://localhost:3000/users?loginSubstring=log&limit=1
app.get('/users', validator.query(paramsSubstringLimitSchema), (req, res) => {
    const substring = req.query.loginSubstring as string;
    const limit = req.query.limit;

    if (!users.length) {
        res.status(404).json({ message: `no users` });
    }

    let sortedUsers: User[] = [];
    const filteredUsers = substring
        ? users.filter((user) => user.login.includes(substring))
        : [...users];

    if (!filteredUsers.length) {
        res.status(404).json({ message: `no users mach the query: ${substring}` });
    } else {
        sortedUsers = filteredUsers.sort((a, b) => (a.login > b.login ? 1 : -1));
        const restrictedUsers = limit ? sortedUsers.splice(0, +limit) : sortedUsers;
        res.status(200).json({ users: restrictedUsers });
    }
});

app.listen(3000);
