import superRequest from 'supertest'
import createApplication from '../app';
import { FindGroupError } from '../middlewares/errorHandlerMiddleware';
import { User } from '../models/models.User';
import {
    JWT,
    message,
    mockGroupService,
    mockUserService, notValidLimit,
    notValidLoginShort, notValidSubstring, notValidUserId,
    validCredentials, validLimit, validSubstring,
    validUserData,
    validUserId
} from "./mocks";
import {getValidJWT} from "./helpers";

const application = createApplication(mockUserService, mockGroupService);

describe('User Controller: ', () => {
    beforeEach(() => {
        mockUserService.getUserByCredentials.mockClear();
    });

    const validJWTTest = () => getValidJWT();

    describe('POST /user/login', () => {
        describe('when credentials passed validation', () => {
            test('should trigger getUserByCredentials method with credentials', async () => {
                const body = validCredentials;
                await superRequest(application).post('/user/login').send(body);
                expect(mockUserService.getUserByCredentials).toBeCalledWith(
                    body.login,
                    body.password
                );
            });
        });
        describe('when credentials not valid', () => {
            test('should respond with 400', async () => {
                const body = {
                    ...validCredentials,
                    login: notValidLoginShort,
                };
                const response = await superRequest(application)
                    .post('/user/login')
                    .send(body);
                expect(mockUserService.getUserByCredentials).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.loginValidationError);
            });
        });
        describe('when user not found by credentials', () => {
            test('should respond with a 401 status code', async () => {
                const body = validCredentials;
                const user = {};
                mockUserService.getUserByCredentials.mockReturnValueOnce(user);
                const response = await superRequest(application)
                    .post('/user/login')
                    .send(body);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidCredentials);
            });
        });
        describe('when user found by credentials', () => {
            const body = validCredentials;
            const user = new User();
            mockUserService.getUserByCredentials.mockReturnValue(user);
            test('should respond with a 200 status code', async () => {
                const response = await superRequest(application)
                    .post('/user/login')
                    .send(body);
                expect(response.status).toBe(200);
            });
            test('should respond with a token', async () => {
                const response = await superRequest(application)
                    .post('/user/login')
                    .send(body);
                expect(response.body.token.length).toBeGreaterThan(83);
                expect(typeof response.body.token).toBe('string');
            });
        });
    });

    describe('POST /user (create user)', () => {
        beforeEach(() => {
            mockUserService.createUser.mockClear();
        });
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const body = validUserData;
                const response = await superRequest(application)
                    .post('/user')
                    .set('jwt-access-token', JWT.notValidJWT)
                    .send(body);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const body = validUserData;
                const response = await superRequest(application).post('/user').send(body);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when user data valid', () => {
            test('should trigger createUser method with user data', async () => {
                const body = validUserData;
                await superRequest(application)
                    .post('/user')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(mockUserService.createUser).toBeCalledWith(body);
            });
            test('should respond with new user', async () => {
                const body = validUserData;
                mockUserService.createUser.mockReturnValueOnce(body);
                const response = await superRequest(application)
                    .post('/user')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(response.body.createdUser).toEqual(body);
            });
            test('should respond with 200', async () => {
                const body = validUserData;
                const response = await superRequest(application)
                    .post('/user')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(response.status).toBe(200);
            });
        });
        describe('when user data not valid', () => {
            test('should respond with 400', async () => {
                const body = {
                    ...validUserData,
                    login: notValidLoginShort,
                };
                const response = await superRequest(application)
                    .post('/user')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(mockUserService.createUser).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.loginValidationError)
            });
        });
    });

    describe('GET /user/:id (get user by id)', () => {
        beforeEach(() => {
            mockUserService.getUserById.mockClear();
        });
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .get(`/user/${validUserId}`)
                    .set('jwt-access-token', JWT.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).get(
                    `/user/${validUserId}`
                );
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when user id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .get(`/user/${notValidUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUserById).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidUserID)
            });
        });
        describe('when user not found', () => {
            test('should respond with 404', async () => {
                mockUserService.getUserById.mockImplementationOnce(() => {
                    throw new FindGroupError('no user');
                });
                const response = await superRequest(application)
                    .get(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUserById).toBeCalledWith(validUserId);
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noUser)
            });
        });
        describe('when user found', () => {
            test('should respond with 200', async () => {
                mockUserService.getUserById.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .get(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUserById).toBeCalledWith(validUserId);
                expect(response.status).toBe(200);
            });
            test('should respond with user data', async () => {
                mockUserService.getUserById.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .get(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUserById).toBeCalledWith(validUserId);
                expect(response.body.user).toEqual(validUserData);
            });
        });
    });

    describe('PUT /user/:id (update user)', () => {
        beforeEach(() => {
            mockUserService.updateUser.mockClear();
        });
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .set('jwt-access-token', JWT.notValidJWT)
                    .send(validUserData);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .send(validUserData);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when user id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .put(`/user/${notValidUserId}`)
                    .set('jwt-access-token', await validJWTTest())
                    .send(validUserData);
                expect(mockUserService.updateUser).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidUserID)
            });
        });
        describe('when user update data not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest())
                    .send({ ...validUserData, login: notValidLoginShort });
                expect(mockUserService.updateUser).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.loginValidationError)
            });
        });
        describe('when user not found', () => {
            test('should respond with 404', async () => {
                mockUserService.updateUser.mockImplementationOnce(() => {
                    throw new FindGroupError('no user');
                });
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest())
                    .send(validUserData);
                expect(mockUserService.updateUser).toBeCalledWith(
                    validUserId,
                    validUserData
                );
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noUser)
            });
        });
        describe('when user found', () => {
            test('should respond with 200', async () => {
                mockUserService.updateUser.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest())
                    .send(validUserData);
                expect(mockUserService.updateUser).toBeCalledWith(
                    validUserId,
                    validUserData
                );
                expect(response.status).toBe(200);
            });
            test('should respond with user data', async () => {
                mockUserService.updateUser.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .put(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest())
                    .send(validUserData);
                expect(mockUserService.updateUser).toBeCalledWith(
                    validUserId,
                    validUserData
                );
                expect(response.body.updatedUser).toEqual(validUserData);
            });
        });
    });

    describe('DELETE /user/:id (delete user)', () => {
        beforeEach(() => {
            mockUserService.deleteUser.mockClear();
        });
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .delete(`/user/${validUserId}`)
                    .set('jwt-access-token', JWT.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).delete(
                    `/user/${validUserId}`
                );
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when user id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .delete(`/user/${notValidUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.deleteUser).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidUserID)
            });
        });
        describe('when user not found', () => {
            test('should respond with 404', async () => {
                mockUserService.deleteUser.mockImplementationOnce(() => {
                    throw new FindGroupError('no user');
                });
                const response = await superRequest(application)
                    .delete(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noUser)
            });
        });
        describe('when user found', () => {
            test('should respond with 200', async () => {
                mockUserService.deleteUser.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .delete(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
                expect(response.status).toBe(200);
            });
            test('should respond with message', async () => {
                mockUserService.deleteUser.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .delete(`/user/${validUserId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
                expect(response.body.message).toEqual(
                    `user with id ${validUserId} marked as deleted`
                );
            });
        });
    });

    describe('GET /users (get users)', () => {
        beforeEach(() => {
            mockUserService.getUsers.mockClear();
        });
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .get(`/users`)
                    .set('jwt-access-token', JWT.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).get(`/users`);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when limit param not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .get(`/users?limit=${notValidLimit}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUsers).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidLimit)
            });
        });
        describe('when loginsubstring param not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .get(`/users?loginsubstring=${notValidSubstring}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUsers).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidSubstring)
            });
        });
        describe('when superRequest valid', () => {
            test('should respond with 200', async () => {
                mockUserService.getUsers.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .get(`/users?limit=${validLimit}&loginsubstring=${validSubstring}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUsers).toBeCalledWith(
                    validSubstring,
                    validLimit
                );
                expect(response.status).toBe(200);
            });
            test('should respond with data', async () => {
                mockUserService.getUsers.mockReturnValueOnce(validUserData);
                const response = await superRequest(application)
                    .get(`/users?limit=${validLimit}&loginsubstring=${validSubstring}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockUserService.getUsers).toBeCalledWith(
                    validSubstring,
                    validLimit
                );
                expect(response.body.users).toEqual(validUserData);
            });
        });
    });
});
