export const mockUserService = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUsers: jest.fn(),
    getUserByCredentials: jest.fn(),
};

export const mockGroupService = {
    createGroup: jest.fn(),
    getGroupById: jest.fn(),
    updateGroup: jest.fn(),
    deleteGroup: jest.fn(),
    getGroups: jest.fn(),
    addUsersToGroup: jest.fn(),
};

export const validCredentials = {
    login: 'log123',
    password: 'password1234',
};

const validGroupPermissions = [
    'READ',
    'WRITE',
    'DELETE',
    'SHARE',
    'UPLOAD_FILES',
];

const validGroupName = 'grpup1';

export const validGroupData = {
    name: validGroupName,
    permissions: validGroupPermissions,
};

export const validUserData = {
    ...validCredentials,
    age: 30,
    is_deleted: false,
};

export const message = {
    noJWT: 'No jwt token provided',
    notValidJWT: 'Failed jwt token',
    notValidGroupID: 'Error validating request params. "id" length must be at least 36 characters long.',
    successfullDelete: (validGroupId:string) => `group with id ${validGroupId} deleted`,
    noGroup: 'no group',
    notValidGroupName: 'Error validating request body. "name" length must be at least 3 characters long.',
    notValidUsers: 'Error validating request body. "usersId[0]" length must be at least 36 characters long. "usersId[1]" length must be at least 36 characters long.',
    notValidUserID: 'Error validating request params. "id" length must be at least 36 characters long.',
    loginValidationError: 'Error validating request body. "login" length must be at least 3 characters long.',
    notValidCredentials: 'Bad Username/Password combination',
    noUser: 'no user',
    notValidLimit: 'Error validating request query. "limit" must be a number.',
    notValidSubstring: 'Error validating request query. "loginsubstring" length must be less than or equal to 10 characters long.',
}

export const notValidGroupId = 'not valid ID';

export const JWT = {
    notValidJWT: 'not valid string'
}

export const notValidGroupNameShort = 'nv';
export const notValidLoginShort = 'nv';

export const createdGroupRelationsName = 'grpup1';

export const validGroupId = 'valid1gr-0up1-id10-okok-okokokokokok';

export const validUserId = 'valid1gr-0up1-id10-okok-okokokokokok';
export const notValidUserId = 'not valid ID';
export const validUserIds = [
    'valid1gr-0up1-id10-okok-okokokokokok',
    'valid1gr-0up1-id20-okok-okokokokokok',
];
export const notValidUserIds = [
    'not0vali-d0us-er01-fail-failfai',
    'not0vali-d0us-er01-fail-failfai',
];

export const validSubstring = 'log';
export const notValidSubstring = 'logxxxxxxxxxx';
export const validLimit = 3;
export const notValidLimit = 'a';
