import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userName: string;
  @IsString()
  password: string;
}
export class CreateUserDto extends UserDto {}
export class LoginUserDto extends UserDto {}
