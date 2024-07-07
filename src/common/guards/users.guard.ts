import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    const decoded = this.jwtService.verifyToken(token);

    const userIdFromJWT = decoded['id'];

    const userIdFromParams = request.params.id;

    return userIdFromJWT === userIdFromParams;
  }
}
