import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class SchedulesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'GET') return true;

    const jwt = this.jwtService.getJwt(request);

    const { roles } = this.jwtService.verifyToken(jwt);

    const body = request.body;
    const businessId = request.params.businessId;

    if (
      !roles.find(
        (role) =>
          role.id === body.ubrId && role.businessId === Number(businessId),
      )
    ) {
      throw new HttpException(
        'Employee does not belong to business',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
