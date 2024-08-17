import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';
import { BusinessesService } from 'src/businesses/businesses.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly businessesService: BusinessesService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);
    if (!jwt) {
      return false;
    }

    const decoded = this.jwtService.verifyToken(jwt);

    const { roleId, id: userId, isFirstAccess } = decoded;

    if (roleId !== RolesIds.admin && !isFirstAccess) return false;

    if (isFirstAccess) {
      const user = await this.usersService.findUserById(userId);
      if (user.role.id !== RolesIds.admin) return false;
    }

    const business = await this.businessesService.findBusinessByAdminId(userId);

    const param = request.params.id;
    if (!param) return false;

    return Number(param) === business.id;
  }
}
