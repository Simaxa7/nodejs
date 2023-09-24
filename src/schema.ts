import * as Joi from 'joi';

export const schemaId = Joi.object({
    id: Joi.string().min(36).max(36).required(),
});

export const paramsSubstringLimitSchema = Joi.object({
    loginSubstring: Joi.string().alphanum().min(1).max(10),
    limit: Joi.number().min(1),
});

export const createUserBodySchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(10),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9][a-zA-Z]|[a-zA-Z][0-9]/)
        .min(8)
        .max(15)
        .required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required(),
});

export const updateUserBodySchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(10),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9][a-zA-Z]|[a-zA-Z][0-9]/)
        .min(8)
        .max(15),
    age: Joi.number().min(4).max(130),
    isDeleted: Joi.boolean(),
});