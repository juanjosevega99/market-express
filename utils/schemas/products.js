const Joi = require('@hapi/joi');

const projectIdSchema = Joi.string().regex(/[0-9a-fA-F]{24}$/);
const projectTagSchema = Joi.array().items(Joi.string().max(30));

const createProjectSchema = {
  name: Joi
    .string()
    .max(50)
    .required(),
  description: Joi
    .string()
    .min(20)
    .max(1000000)
    .required(),
  image: Joi.string().required(),
  link: Joi.string().required(),
  tags: projectTagSchema
};

const updateProjectSchema = {
  name: Joi.string().max(50),
  description: Joi
    .string()
    .min(20)
    .max(1000000),
  image: Joi.string(),
  link: Joi.string(),
  tags: projectTagSchema
};

module.exports = {
  projectIdSchema,
  projectTagSchema,
  createProjectSchema,
  updateProjectSchema
};