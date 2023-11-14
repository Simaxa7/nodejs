import {createValidator} from 'express-joi-validation';
import {
    createGroupBodySchema,
    createGroupRelationsBodySchema,
    createUserBodySchema,
    paramsIDSchema,
    querySubstringLimitSchema,
    updateGroupBodySchema,
    updateUserBodySchema,
    getUserByCredentialsBodySchema,
} from './schemas';

const validator = createValidator();

export const userBodyValidatorOnCreate = validator.body(createUserBodySchema);
export const userBodyValidatorOnUpdate = validator.body(updateUserBodySchema);
export const paramsIdValidator = validator.params(paramsIDSchema)
export const userQuerySubstringLimitValidator = validator.query(querySubstringLimitSchema)
export const groupBodyValidatorOnCreate = validator.body(createGroupBodySchema)
export const groupBodyValidatorOnUpdate = validator.body(updateGroupBodySchema)
export const groupRelationsBodyValidator = validator.body(createGroupRelationsBodySchema)
export const userBodyCredentialsValidator = validator.body(getUserByCredentialsBodySchema)
