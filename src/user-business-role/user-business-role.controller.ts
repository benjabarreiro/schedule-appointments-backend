import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BusinessAdminGuard } from 'src/common/guards/business-admin.guard';
import { UserBusinessRoleService } from './user-business-role.service';

@Controller('user-business-role')
@UseGuards(BusinessAdminGuard)
export class UserBusinessRoleController {
  constructor(
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {}

  @Get()
  async getAllUbr() {
    return this.userBusinessRoleService.findAllUbr();
  }

  @Post('/:businessId/:userId')
  async addUserToBusiness(
    @Param('businessId') businessId,
    @Param('userId') userId,
  ): Promise<string> {
    try {
      return await this.userBusinessRoleService.addUserToBusiness(
        Number(userId),
        Number(businessId),
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:businessId/:userId')
  @UseGuards(BusinessAdminGuard)
  async removeUserFromBusiness(
    @Param('businessId') businessId,
    @Param('userId') userId,
  ): Promise<string> {
    try {
      return await this.userBusinessRoleService.removeUserFromBusiness(
        Number(userId),
        Number(businessId),
      );
    } catch (err) {
      throw err;
    }
  }
}
