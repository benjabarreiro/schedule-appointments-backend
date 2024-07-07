export interface IJwtPayload {
  email: string;
  id: number;
}

export interface IJwt extends IJwtPayload {
  iat: number;
  exp: number;
}
