import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import {User} from "../models/models.User";

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type GroupUpdates = {
    id?: string;
    name?: string;
    permissions?: Array<Permission>;
    users?: User[];
};

export interface ParamsIDSchema extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        id: string;
    };
}

export interface QuerySubstringLimitSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        loginsubstring?: string;
        limit?: number;
    };
}

export interface CreateUserBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string;
        password: string;
        age: number;
        is_deleted: boolean;
    };
}

export interface UpdateUserBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login?: string;
        password?: string;
        age?: number;
        is_deleted?: boolean;
    };
}

export interface CreateGroupBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string;
        permissions: Permission[];
    };
}

export interface UpdateGroupBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name?: string;
        permissions?: Permission[];
    };
}

export interface CreateGroupRelationsBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        usersId: string[];
    };
}

export interface GetUserByCredentialsBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string;
        password: string;
    };
}
