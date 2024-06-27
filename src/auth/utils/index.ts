import { HttpException, HttpStatus } from '@nestjs/common';
import { hashSync } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = hashSync(password, 10);
    return hashedPassword;
  } catch (err) {
    throw new HttpException(
      'There was an error hashing password',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const generateValidationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
