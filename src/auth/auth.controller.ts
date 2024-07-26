import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UserDto } from '../common/dtos';
import { loginSchema, userSchema } from '../common/schemas';
import { JoiValidationPie } from '../common/pipes';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPie<CreateUserDto>(userSchema))
  async createUser(@Body() body: CreateUserDto): Promise<string> {
    return await this.authService.createUser(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPie<UserDto>(loginSchema))
  async login(@Body() body: LoginUserDto): Promise<string> {
    return await this.authService.login(body);
  }

  @Post('/validate-code')
  @HttpCode(HttpStatus.CREATED)
  async validateCode(@Body('code') code: string): Promise<string> {
    return await this.authService.validateCode(code);
  }
}
