import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);

    const decoded = this.jwtService.verifyToken(jwt);

    const { roleId, id: userId, isFirstAccess } = decoded;

    if (roleId !== RolesIds.admin && !isFirstAccess) return false;

    if (isFirstAccess) {
      const user = await this.usersService.findUserById(userId);
      if (user.role.id !== RolesIds.admin) return false;
    }

    return true;
  }
}
