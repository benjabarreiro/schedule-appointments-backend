export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: any;
  birthDate: Date;
}

export class UserAuthDto extends UserDto {
  password: string;
}
