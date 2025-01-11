import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const jwt = this.jwtService.getJwt(req);

    try {
      const decoded = this.jwtService.verifyToken(jwt);

      const userIdFromJWT = decoded['id'];

      const userIdFromParams = parseInt(req.params.id, 10); // Parse user ID from route parameters

      console.log(userIdFromJWT, userIdFromParams);
      if (userIdFromJWT !== userIdFromParams) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to access this resource' });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: error.message || 'Invalid token' });
    }
  }
}
