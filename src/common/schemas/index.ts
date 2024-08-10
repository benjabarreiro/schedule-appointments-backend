import * as Joi from 'joi';
import * as JoiDate from '@joi/date';

const JoiPipe = Joi.extend(JoiDate);

export const userSchema = JoiPipe.object({
  firstName: JoiPipe.string()
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .not()
    .empty()
    .min(2),
  lastName: JoiPipe.string()
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .not()
    .empty()
    .min(2),
  email: JoiPipe.string().email().required().not().empty(),
  phone: JoiPipe.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .not()
    .empty(),
  birthDate: JoiPipe.date()
    .format('YYYY-MM-DD')
    .required() // Make sure the date field is provided
    .custom((value, helper) => {
      if (typeof helper.original !== 'string')
        return helper.error('Birth date value must be a string');

      const today = new Date();
      const birthYear = value.getFullYear();
      const ageDifference =
        (today.getMonth() === value.getMonth() ? 0 : 1) +
        (today.getDate() < value.getDate() ? 0 : -1);
      const age = today.getFullYear() - birthYear - ageDifference;

      if (age < 12) {
        return helper.error(
          'birth date must be for someone at least 12 years old',
        );
      }

      return value;
    }),
  password: JoiPipe.string().required().not().empty().min(4),
});

export const loginSchema = JoiPipe.object({
  email: JoiPipe.string().email().required().not().empty(),
  password: JoiPipe.string().required().not().empty(),
});

export const updateUserSchema = JoiPipe.object({
  firstName: JoiPipe.string()
    .pattern(/^[a-zA-Z]+$/)
    .not()
    .empty()
    .min(2),
  lastName: JoiPipe.string()
    .pattern(/^[a-zA-Z]+$/)
    .not()
    .empty()
    .min(2),
  phone: JoiPipe.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .not()
    .empty(),
  birthDate: JoiPipe.date()
    .format('YYYY-MM-DD')
    .custom((value, helper) => {
      if (typeof helper.original !== 'string')
        return helper.error('birth date value must be a string');

      const today = new Date();
      const birthYear = value.getFullYear();
      const ageDifference =
        (today.getMonth() === value.getMonth() ? 0 : 1) +
        (today.getDate() < value.getDate() ? 0 : -1);
      const age = today.getFullYear() - birthYear - ageDifference;

      if (age < 12) {
        return helper.error(
          'birth date must be for someone at least 12 years old',
        );
      }

      return value;
    }),
});
