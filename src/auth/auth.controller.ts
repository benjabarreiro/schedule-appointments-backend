import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { loginSchema, userSchema } from './schemas';
import { JoiValidationPipe } from './pipes';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(userSchema))
  createUser(@Body() body: CreateUserDto): Promise<string> | string {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPipe(loginSchema))
  login(@Body() body: LoginUserDto): Promise<string> | string {
    return this.authService.login(body);
  }

  @Post('validate-code')
  @HttpCode(HttpStatus.CREATED)
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
