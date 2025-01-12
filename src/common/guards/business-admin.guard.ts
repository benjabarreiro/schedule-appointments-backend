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

    const requestId = Number(request.params.id) || request.body.businessId;

    if (!requestId) return false;

    const { id: userId } = decoded;

    let userRoles = await this.userBusinessRoleService.findAllUserRoles(userId);

    console.log(userRoles);

    const isAdmin = userRoles.some(
      (role) =>
        role.roleId === RolesIds.admin &&
        role.userId === userId &&
        role.businessId === requestId,
    );

    console.log(isAdmin);

    if (!isAdmin) return false;

    return true;
  }
}
