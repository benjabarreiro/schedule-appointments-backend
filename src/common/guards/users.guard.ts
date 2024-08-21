import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);

    const decoded = this.jwtService.verifyToken(jwt);

    const userIdFromJWT = decoded['id'];

    const userIdFromParams = request.params.id;

    return userIdFromJWT === parseInt(userIdFromParams);
  }
}
