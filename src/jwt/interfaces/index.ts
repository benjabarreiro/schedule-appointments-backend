import { JwtPayload } from 'jsonwebtoken';

export interface IJwt extends JwtPayload {
  email: string;
  id: number;
  roleId: number;
  businessId: number;
  employeeId: number;
  isFirstAccess?: boolean;
}
