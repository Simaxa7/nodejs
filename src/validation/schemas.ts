import * as Joi from 'joi';

export const paramsIDSchema = Joi.object({
    id: Joi.string().min(36).max(36).required(),
});

export const querySubstringLimitSchema = Joi.object({
    loginsubstring: Joi.string().alphanum().min(1).max(10),
    limit: Joi.number().min(1),
});

export const createUserBodySchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(10).required(),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9][a-zA-Z]|[a-zA-Z][0-9]/)
        .min(8)
        .max(15)
        .required(),
    age: Joi.number().min(4).max(130).required(),
    is_deleted: Joi.boolean().required(),
});

export const updateUserBodySchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(10),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9][a-zA-Z]|[a-zA-Z][0-9]/)
        .min(8)
        .max(15),
    age: Joi.number().min(4).max(130),
    is_deleted: Joi.boolean(),
});

export const createGroupBodySchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(10).required(),
    permissions: Joi.array().items(
        Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES').required()
    ),
});

export const updateGroupBodySchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(10),
    permissions: Joi.array().items(
        Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    ),
});

export const createGroupRelationsBodySchema = Joi.object({
    usersId: Joi.array().items(
        Joi.string().min(36).max(36)
    ),
});

export const getUserByCredentialsBodySchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(10).required(),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9][a-zA-Z]|[a-zA-Z][0-9]/)
        .min(8)
        .max(15)
        .required(),
});
