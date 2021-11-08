import Joi from 'joi';
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const idSchema = Joi.string().uuid()
  .required();

export const userPostSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().pattern(passwordPattern)
    .required(),
  age: Joi.number().integer()
    .min(4)
    .max(130)
    .required()
});

export const userPutSchema = Joi.object({
  login: Joi.string(),
  password: Joi.string().pattern(passwordPattern),
  age: Joi.number().integer()
    .min(4)
    .max(130),
  isDeleted: Joi.boolean().prefs({ convert: false })
});
