import {
  BadRequestException,
  Body,
  Controller,
  Injectable,
  Param,
  PipeTransform,
  Put,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dtos';
import * as Joi from 'joi';
import * as JoiDate from '@joi/date';

const JoiPipe = Joi.extend(JoiDate);

const updateUserSchema = JoiPipe.object({
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

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: UpdateUserDto) {
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

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  async updateUser(
    @Body(new JoiValidationPipe(updateUserSchema)) body: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(body, Number(id));
  }
}
