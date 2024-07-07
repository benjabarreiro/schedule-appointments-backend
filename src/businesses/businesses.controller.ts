import { Body, Controller, Post } from '@nestjs/common';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post('')
  async createBusiness(@Body() body: any) {
    try {
      return await this.businessesService.createBusiness(body);
    } catch (err) {}
  }

  @Post('/add-user')
  async addUserToBusiness(@Body() body) {
    try {
      return await this.businessesService.addUserToBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {}
  }
}
