import { ValidateCreateUserDto } from '../dtos';

export interface ValidationRecord {
  code: string;
  expiresAt: Date;
  user: ValidateCreateUserDto;
}
