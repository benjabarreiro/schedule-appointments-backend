import { hashSync } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = hashSync(password, 10);
  return hashedPassword;
};

export const generateValidationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
