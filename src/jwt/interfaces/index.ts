import { JwtPayload } from 'jsonwebtoken';

export interface IJwt extends JwtPayload {
  email: string;
  id: number;
}
