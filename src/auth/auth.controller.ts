import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dtos';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  createUser(@Body() body: CreateUserDto): Promise<string> | string {
    if (!body || !Object.keys(body).length)
      throw new HttpException(
        'Body cannot be empty' + body,
        HttpStatus.BAD_REQUEST,
      );
    return this.authService.createUser(body);
  }

  @Post('/login')
  login(@Body() body: LoginUserDto): Promise<string> | string {
    if (!body || !Object.keys(body).length)
      throw new HttpException(
        'Body cannot be empty' + body,
        HttpStatus.BAD_REQUEST,
      );
    return this.authService.login(body);
  }
}
