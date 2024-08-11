import * as Joi from 'joi';

export const createBusinessSchema = Joi.object({
  name: Joi.string().required().not().empty().min(10),
  plan: Joi.number().required().not().empty(),
  isActive: Joi.boolean().required().not().empty(),
});
