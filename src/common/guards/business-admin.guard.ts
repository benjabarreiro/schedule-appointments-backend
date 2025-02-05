import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';

@Injectable()
export class BusinessAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'GET') return true;

    const jwt = this.jwtService.getJwt(request);

    const { roles } = this.jwtService.verifyToken(jwt);

    const businessIdFromParams = parseInt(request.params.businessId, 10); // Parse user ID from route parameters

    const userRole = roles.find(
      (role) => role.businessId === businessIdFromParams,
    );
    const isUserAdmin = userRole?.roleId === RolesIds.admin || false;
    if (!isUserAdmin) {
      return false;
    }

    return true;
  }
}
