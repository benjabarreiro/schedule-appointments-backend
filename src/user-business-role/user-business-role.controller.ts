import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AddUserToBusiness } from 'src/businesses/dtos';
import { BusinessAdminGuard } from 'src/common/guards/business-admin.guard';
import { UserBusinessRoleService } from './user-business-role.service';

@Controller('user-business-role')
export class UserBusinessRoleController {
  constructor(
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {}

  @Get()
  async getAllUbr() {
    return this.userBusinessRoleService.findAllUbr();
  }

  @Post('/business/user')
  @UseGuards(BusinessAdminGuard)
  async addUserToBusiness(@Body() body: AddUserToBusiness): Promise<string> {
    try {
      return await this.userBusinessRoleService.addUserToBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete('/business/user')
  @UseGuards(BusinessAdminGuard)
  async removeUserFromBusiness(
    @Body() body: AddUserToBusiness,
  ): Promise<string> {
    try {
      return await this.userBusinessRoleService.removeUserFromBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {
      throw err;
    }
  }
}
