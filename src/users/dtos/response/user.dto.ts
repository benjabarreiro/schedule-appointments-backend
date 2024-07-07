export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: any;
  birthDate: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class UserAuthDto extends UserDto {
  password: string;
}
