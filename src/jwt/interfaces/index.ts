import { JwtPayload } from 'jsonwebtoken';
import { Roles } from 'src/user-business-role/interfaces';

export interface IJwt extends JwtPayload {
  email: string;
  id: number;
  roles: Roles[];
  isFirstAccess?: boolean;
}
