import { ValidateCreateUserDto } from '../../common/dtos';

export interface ValidationRecord {
  code: string;
  expiresAt: Date;
  user: ValidateCreateUserDto;
}
