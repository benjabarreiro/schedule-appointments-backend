import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';
import { BusinessesService } from 'src/businesses/businesses.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly businessesService: BusinessesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    const decoded = this.jwtService.verifyToken(token);

    const { roleId, businessId, id } = decoded;

    const business = await this.businessesService.findBusinessById(businessId);

    return (
      roleId === RolesIds.admin &&
      business.id === businessId &&
      business.adminId === id
    );
  }
}
