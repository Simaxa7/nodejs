import {User} from "../models/models.User";
import superRequest from "supertest";
import createApplication from "../app";
import {mockGroupService, mockUserService, validCredentials} from "./mocks";

const application = createApplication(mockUserService, mockGroupService);

export async function getValidJWT() {
    const credentials = validCredentials;
    const user = new User();
    mockUserService.getUserByCredentials.mockReturnValue(user);
    const response = await superRequest(application)
        .post('/user/login')
        .send(credentials);
    console.log('response.body.token=', response.body.token)
    return response.body.token;
}
