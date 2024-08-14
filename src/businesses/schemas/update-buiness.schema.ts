import * as Joi from 'joi';

const validateIsNotString = (value, helper) => {
  if (typeof helper.original === 'string') {
    throw Error(`it is not a ${helper.schema.type}`);
  }
  return value;
};

export const updateBusinessSchema = Joi.object({
  name: Joi.string().not().empty().min(10),
  plan: Joi.number().not().empty().custom(validateIsNotString),
  isActive: Joi.boolean().not().empty().custom(validateIsNotString),
});
