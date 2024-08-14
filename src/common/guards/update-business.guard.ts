import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BusinessesService } from 'src/businesses/businesses.service';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UpdateBusinessGuards implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.jwtService.getJwt(request);
    if (!jwt) {
      return false;
    }

    const decoded = this.jwtService.verifyToken(jwt);
    console.log(decoded);

    const { businessId } = decoded;

    await this.businessService.findBusinessById(businessId);

    if (Number(request.params.id) !== businessId) return false;

    return true;
  }
}
