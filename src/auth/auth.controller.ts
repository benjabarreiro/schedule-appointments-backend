import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangeUserPassword,
  CreateUserDto,
  LoginUserDto,
  UserDto,
} from '../common/dtos';
import {
  changeUserPasswordSchema,
  loginSchema,
  userSchema,
} from '../common/schemas';
import { JoiValidationPipe } from '../common/pipes';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe<CreateUserDto>(userSchema))
  async createUser(@Body() body: CreateUserDto): Promise<string> {
    return await this.authService.createUser(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPipe<UserDto>(loginSchema))
  async login(@Body() body: LoginUserDto): Promise<string> {
    return await this.authService.login(body);
  }

  @Post('/validate-code')
  @HttpCode(HttpStatus.CREATED)
  async validateCode(@Body('code') code: string): Promise<string> {
    return await this.authService.validateCode(code);
  }

  @Post('/change-password')
  @UsePipes(new JoiValidationPipe<UserDto>(changeUserPasswordSchema))
  async changePassword(@Body() body: ChangeUserPassword): Promise<String> {
    return await this.authService.changePassword(body);
  }
}
