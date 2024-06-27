import { BadRequestException, PipeTransform } from '@nestjs/common';
import Joi from 'joi';
import { UserDto } from '../dtos';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: UserDto) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      const buildErrorMessage = {};
      error.details.map(
        (err) =>
          (buildErrorMessage[err.context.label] = err.message.replace(
            /[\\"]/g,
            '',
          )),
      );
      throw new BadRequestException({
        input: error._original,
        errors: buildErrorMessage,
      });
    }
    return value;
  }
}