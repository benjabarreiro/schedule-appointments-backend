import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { UserBusinessRoleService } from 'src/user-business-role/user-business-role.service';
import { RolesIds } from '../enums';

@Injectable()
export class BusinessAdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);

    const decoded = this.jwtService.verifyToken(jwt);

    const requestId = request.params.id || request.body.businessId;

    if (!requestId) return false;

    const { id: userId, isFirstAccess, roles } = decoded;

    let userRoles = roles;

    if (isFirstAccess) {
      userRoles = await this.userBusinessRoleService.findAllUserRoles(userId);
    }

    const isAdmin = userRoles.some(
      (role) =>
        role.roleId === RolesIds.admin &&
        role.userId === userId &&
        role.businessId === requestId,
    );

    if (!isAdmin) return false;

    return true;
  }
}
