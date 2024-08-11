import * as Joi from 'joi';

export const updateBusinessSchema = Joi.object({
  name: Joi.string().not().empty().min(10),
  plan: Joi.number()
    .not()
    .empty()
    .custom((value, helper) => {
      if (typeof helper.original === 'string') {
        throw Error('Plan must be a number');
      }
      return value;
    }),
  isActive: Joi.boolean()
    .not()
    .empty()
    .custom((value, helper) => {
      if (typeof helper.original === 'string') {
        throw Error('isActive must be a boolean');
      }
      return value;
    }),
});
