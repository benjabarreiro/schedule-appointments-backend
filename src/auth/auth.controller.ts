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
import { AuthPipe } from './pipes';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new AuthPipe(userSchema))
  createUser(@Body() body: CreateUserDto): Promise<string> | string {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new AuthPipe(loginSchema))
  login(@Body() body: LoginUserDto): Promise<string> | string {
    return this.authService.login(body);
  }

  @Post('/validate-code')
  @HttpCode(HttpStatus.CREATED)
  async validateCode(@Body('code') code: string) {
    return this.authService.validateCode(code);
  }
}
