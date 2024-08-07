import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { RolesIds } from '../enums';
import { BusinessesService } from 'src/businesses/businesses.service';

@Injectable()
export class EmployeesGuard implements CanActivate {
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

    const { roleId, businessId, employeeId } = decoded;

    const business = await this.businessesService.findBusinessById(businessId);

    const isEmployee = await this.businessesService.findEmployeeInBusiness(
      business.adminId,
      employeeId,
    );

    return (
      roleId === RolesIds.employee && business.id === businessId && !!isEmployee
    );
  }
}
