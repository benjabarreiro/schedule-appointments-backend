import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const jwt = this.jwtService.getJwt(req);
    if (!jwt) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      this.jwtService.verifyToken(jwt);
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ status: error.status, message: error.message });
    }
  }
}
