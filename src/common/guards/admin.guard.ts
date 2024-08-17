import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';
import { BusinessesService } from 'src/businesses/businesses.service';

@Injectable()
export class AdminsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly businessesService: BusinessesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);
    if (!jwt) {
      return false;
    }

    const decoded = this.jwtService.verifyToken(jwt);

    const { roleId, id: userId } = decoded;

    if (roleId !== RolesIds.admin) return false;

    const business = await this.businessesService.findBusinessByAdminId(userId);

    const param = request.params.id;
    if (!param) return false;

    return Number(param) === business.id;
  }
}
