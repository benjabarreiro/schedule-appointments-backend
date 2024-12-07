import { IsDate, IsOptional, IsString } from 'class-validator';

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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsDate()
  birthDate?: Date;
}

export class ChangeUserPassword extends UserDto {
  @IsString()
  newPassword: string;
}
