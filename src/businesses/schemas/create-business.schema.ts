import * as Joi from 'joi';

export const createBusinessSchema = Joi.object({
  name: Joi.string().required().not().empty().min(10),
  plan: Joi.number()
    .required()
    .not()
    .empty()
    .custom((value, helper) => {
      if (typeof helper.original === 'string') {
        throw Error('Plan must be a number');
      }
      return value;
    }),
  isActive: Joi.boolean()
    .required()
    .not()
    .empty()
    .custom((value, helper) => {
      if (typeof helper.original === 'string') {
        throw Error('isActive must be a boolean');
      }
      return value;
    }),
});
