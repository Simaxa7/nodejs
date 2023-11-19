import superRequest from 'supertest';
import createApplication from '../app';
import { FindGroupError } from '../middlewares/errorHandlerMiddleware';
import {getValidJWT} from "./helpers";
import {
    createdGroupRelationsName,
    JWT,
    message,
    mockGroupService,
    mockUserService,
    notValidGroupId,
    notValidGroupNameShort, notValidUserIds,
    validGroupData, validGroupId, validUserIds
} from "./mocks";

const application = createApplication(mockUserService, mockGroupService);

describe('Group Controller: ', () => {
    beforeEach(() => {
        mockGroupService.createGroup.mockClear();
    });
    const validJWTTest = () => getValidJWT();
    const body = validGroupData;

    describe('POST /group (create group)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .post('/group')
                    .set('jwt-access-token', JWT.notValidJWT)
                    .send(body);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application)
                    .post('/group')
                    .send(body);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when group data valid', () => {
            test('should trigger createGroup method with group data', async () => {
                await superRequest(application)
                    .post('/group')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(mockGroupService.createGroup).toBeCalledWith(body);
            });
            test('should respond with new group', async () => {
                mockGroupService.createGroup.mockReturnValueOnce(body);
                const response = await superRequest(application)
                    .post('/group')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(response.body.createdGroup).toEqual(body);
            });
            test('should respond with 200', async () => {
                const response = await superRequest(application)
                    .post('/group')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(response.status).toBe(200);
            });
        });
        describe('when group data not valid', () => {
            test('should respond with 400', async () => {
                const body = {
                    ...validGroupData,
                    name: notValidGroupNameShort,
                };
                const response = await superRequest(application)
                    .post('/group')
                    .set('jwt-access-token', await validJWTTest())
                    .send(body);
                expect(mockGroupService.createGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupName)
            });
        });
    });

    describe('GET /group/:id (get group by id)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .get(`/group/${validGroupId}`)
                    .set('jwt-access-token', message.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).get(
                    `/group/${validGroupId}`
                );
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when group id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .get(`/group/${notValidGroupId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockGroupService.getGroupById).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupID)
            });
        });
        describe('when group not found', () => {
            test('should respond with 404', async () => {
                mockGroupService.getGroupById.mockImplementationOnce(() => {
                    throw new FindGroupError('no group');
                });
                const response = await superRequest(application)
                    .get(`/group/${validGroupId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noGroup)
            });
        });
        describe('when group found', () => {
            test('should respond with 200', async () => {
                mockGroupService.getGroupById.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .get(`/group/${validGroupId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
                expect(response.status).toBe(200);
            });
            test('should respond with group data', async () => {
                mockGroupService.getGroupById.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .get(`/group/${validGroupId}`)
                    .set('jwt-access-token', await validJWTTest());
                expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
                expect(response.body.group).toEqual(validGroupData);
            });
        });
    });

    describe('GET /groups (get groups)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .get(`/groups`)
                    .set('jwt-access-token', message.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).get(`/groups`);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when groups found', () => {
            test('should respond with 200', async () => {
                mockGroupService.getGroups.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .get(`/groups`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.getGroups).toBeCalledWith();
                expect(response.status).toBe(200);
            });
            test('should respond with data', async () => {
                mockGroupService.getGroups.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .get(`/groups`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.getGroups).toBeCalledWith();
                expect(response.body.groups).toEqual(validGroupData);
            });
        });
        describe('when groups not found', () => {
            test('should respond with 404', async () => {
                mockGroupService.getGroups.mockImplementationOnce(() => {
                    throw new FindGroupError('no group');
                });
                const response = await superRequest(application)
                    .get(`/groups`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.getGroups).toBeCalledWith();
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noGroup)
            });
        });
    });

    describe('PUT /group/:id (update group)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .set('jwt-access-token', message.notValidJWT)
                    .send(validGroupData);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .send(validGroupData);
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when group id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .put(`/group/${notValidGroupId}`)
                    .set('jwt-access-token', await getValidJWT())
                    .send(validGroupData);
                expect(mockGroupService.updateGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupID)
            });
        });
        describe('when group update data not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT())
                    .send({ ...validGroupData, name: notValidGroupNameShort });
                expect(mockGroupService.updateGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupName)
            });
        });
        describe('when group not found', () => {
            test('should respond with 404', async () => {
                mockGroupService.updateGroup.mockImplementationOnce(() => {
                    throw new FindGroupError('no group');
                });
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT())
                    .send(validGroupData);
                expect(mockGroupService.updateGroup).toBeCalledWith(
                    validGroupId,
                    validGroupData
                );
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noGroup)
            });
        });
        describe('when group found', () => {
            test('should respond with 200', async () => {
                mockGroupService.updateGroup.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT())
                    .send(validGroupData);
                expect(mockGroupService.updateGroup).toBeCalledWith(
                    validGroupId,
                    validGroupData
                );
                expect(response.status).toBe(200);
            });
            test('should respond with group data', async () => {
                mockGroupService.updateGroup.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .put(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT())
                    .send(validGroupData);
                expect(mockGroupService.updateGroup).toBeCalledWith(
                    validGroupId,
                    validGroupData
                );
                expect(response.body.updatedGroup).toEqual(validGroupData);
            });
        });
    });

    describe('DELETE /group/:id (delete group)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .delete(`/group/${validGroupId}`)
                    .set('jwt-access-token', message.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).delete(
                    `/group/${validGroupId}`
                );
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when group id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .delete(`/group/${notValidGroupId}`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.deleteGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupID)
            });
        });
        describe('when group not found', () => {
            test('should respond with 404', async () => {
                mockGroupService.deleteGroup.mockImplementationOnce(() => {
                    throw new FindGroupError('no group');
                });
                const response = await superRequest(application)
                    .delete(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.deleteGroup).toBeCalledWith(validGroupId);
                expect(response.status).toBe(404);
                expect(response.text).toBe(message.noGroup)
            });
        });
        describe('when group found', () => {
            test('should respond with 200', async () => {
                mockGroupService.deleteGroup.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .delete(`/group/${validGroupId}`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.deleteGroup).toBeCalledWith(validGroupId);
                expect(response.status).toBe(200);
                expect(response.body.message).toBe(message.successfullDelete(validGroupId))
            });
        });
    });

    describe('POST /group/:id/addusers add users to group)', () => {
        describe('when jwt not valid', () => {
            test('should respond with 401', async () => {
                const response = await superRequest(application)
                    .post(`/group/${validGroupId}/addusers`)
                    .set('jwt-access-token', message.notValidJWT);
                expect(response.status).toBe(401);
                expect(response.text).toBe(message.notValidJWT)
            });
        });
        describe('when no jwt', () => {
            test('should respond with 403 ', async () => {
                const response = await superRequest(application).post(
                    `/group/${validGroupId}/addusers`
                );
                expect(response.status).toBe(403);
                expect(response.text).toBe(message.noJWT)
            });
        });
        describe('when group id not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .post(`/group/${notValidGroupId}/addusers`)
                    .set('jwt-access-token', await getValidJWT());
                expect(mockGroupService.addUsersToGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidGroupID)
            });
        });
        describe('when user ids not valid', () => {
            test('should respond with 400', async () => {
                const response = await superRequest(application)
                    .post(`/group/${validGroupId}/addusers`)
                    .set('jwt-access-token', await getValidJWT())
                    .send({ usersId: notValidUserIds });
                expect(mockGroupService.addUsersToGroup).not.toBeCalled();
                expect(response.status).toBe(400);
                expect(response.text).toBe(message.notValidUsers)
            });
        });
        describe('when request valid', () => {
            test('should respond with 200', async () => {
                mockGroupService.addUsersToGroup.mockReturnValueOnce(validGroupData);
                const response = await superRequest(application)
                    .post(`/group/${validGroupId}/addusers`)
                    .set('jwt-access-token', await getValidJWT())
                    .send({ usersId: validUserIds });
                expect(mockGroupService.addUsersToGroup).toBeCalledWith(
                    validGroupId,
                    validUserIds
                );
                expect(response.status).toBe(200);
                expect(response.body.createdGroupRelations.name).toBe(createdGroupRelationsName)
            });
        });
    });
});
