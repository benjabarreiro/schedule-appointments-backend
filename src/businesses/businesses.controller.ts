import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { AddUserToBusiness, CreateBusinessDto } from './dtos';
import { AdminsGuard } from 'src/common/guards/admin.guard';
import { JwtService } from 'src/jwt/jwt.service';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly jwtService: JwtService,
  ) {}
  @Post()
  async createBusiness(
    @Body() body: CreateBusinessDto,
    @Headers('Authorization') authHeader,
  ): Promise<string> {
    try {
      const { userId: adminId } = this.jwtService.verifyToken(authHeader);
      return await this.businessesService.createBusiness(body, adminId);
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
