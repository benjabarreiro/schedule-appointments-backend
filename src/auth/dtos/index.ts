import { IsDate, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
export class CreateUserDto extends UserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phone: string;
  @IsDate()
  birthDate: Date;
}
export class LoginUserDto extends UserDto {}
