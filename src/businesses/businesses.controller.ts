import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { AddUserToBusiness, CreateBusinessDto } from './dtos';
import { AdminsGuard } from 'src/common/guards/admin.guard';
import { UsersGuard } from 'src/common/guards/users.guard';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post()
  @UseGuards(UsersGuard)
  async createBusiness(@Body() body: CreateBusinessDto): Promise<string> {
    try {
      return await this.businessesService.createBusiness(body);
    } catch (err) {
      throw err;
    }
  }

  @Post('/add-user')
  @UseGuards(AdminsGuard)
  async addUserToBusiness(@Body() body: AddUserToBusiness): Promise<string> {
    try {
      return await this.businessesService.addUserToBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {}
  }
}
