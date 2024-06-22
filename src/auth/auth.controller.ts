import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  PipeTransform,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UserDto } from './dtos';
import * as Joi from 'joi';
import * as JoiDate from '@joi/date';

const JoiPipe = Joi.extend(JoiDate);

const userSchema = JoiPipe.object({
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

const loginSchema = JoiPipe.object({
  email: JoiPipe.string().email().required().not().empty(),
  password: JoiPipe.string().required().not().empty(),
});

@Injectable()
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

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(userSchema))
  createUser(@Body() body: CreateUserDto): Promise<string> | string {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  login(@Body() body: LoginUserDto): Promise<string> | string {
    return this.authService.login(body);
  }

  @Post('validate-code')
  @HttpCode(HttpStatus.OK)
  async validateCode(@Body('code') code: string) {
    const isValid = this.authService.validateCode(code);
    if (!isValid) {
      return {
        message: 'Invalid or expired code',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }

    return {
      message: 'Email validated successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
