import Joi from 'joi';
// eslint-disable-next-line no-useless-escape
const passwordPattern = new RegExp(`^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{4,120}$`);

export const userPostSchema = Joi.object({
  id: Joi.string().uuid(),
  login: Joi.string().required(),
  password: Joi
    .string()
    .pattern(passwordPattern)
    .required(),
  age: Joi
    .number()
    .integer()
    .min(4)
    .max(130)
    .required(),
  isDeleted: Joi
    .boolean()
    .required()
    .prefs({ convert: false })
});

export const userPutSchema = Joi.object({
  id: Joi
    .string()
    .uuid()
    .required(),
  login: Joi.string(),
  password: Joi.string().pattern(passwordPattern),
  age: Joi
    .number()
    .integer()
    .min(4)
    .max(130),
  isDeleted: Joi.boolean().prefs({ convert: false })
});
export const userDeleteSchema = Joi.object({
  id: Joi
    .string()
    .uuid()
    .required()
});
