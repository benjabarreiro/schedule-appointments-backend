import {
  ArgumentMetadata,
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UserDto } from './dtos';
import * as Joi from 'joi';

const userSchema = Joi.object({
  userName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .exist()
    .min(2),
  password: Joi.string().exist().min(4),
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
  @UsePipes(new JoiValidationPipe(userSchema))
  login(@Body() body: LoginUserDto): Promise<string> | string {
    return this.authService.login(body);
  }
}
