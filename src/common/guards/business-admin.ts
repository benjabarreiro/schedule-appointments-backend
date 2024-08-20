import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { BusinessesService } from 'src/businesses/businesses.service';

@Injectable()
export class BusinessAdminGuard implements CanActivate {
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

    const requestId = request.params.id || request.body.businessId;
    if (!requestId) return false;

    const { businessId, id: userId, isFirstAccess } = decoded;

    if (businessId !== requestId && !isFirstAccess) return false;

    if (isFirstAccess) {
      const business = await this.businessesService.findBusinessByAdminId(
        userId,
      );
      if (business.id !== requestId) return false;
    }

    return true;
  }
}
