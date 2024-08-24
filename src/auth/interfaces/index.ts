import { CreateUserDto } from '../../common/dtos';

export interface ValidationRecord {
  code: string;
  expiresAt: Date;
  user: CreateUserDto;
}
