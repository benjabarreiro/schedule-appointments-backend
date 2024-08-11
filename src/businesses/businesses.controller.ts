import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { AddUserToBusiness, CreateBusinessDto } from './dtos';
import { AdminsGuard } from 'src/common/guards/admin.guard';
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly jwtService: JwtService,
  ) {}
  @Post()
  async createBusiness(
    @Body() body: CreateBusinessDto,
    req: Request,
  ): Promise<string> {
    try {
      const jwt = this.jwtService.getJwt(req);
      const { userId: adminId } = this.jwtService.verifyToken(jwt);
      return await this.businessesService.createBusiness(body, adminId);
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  async getBusiness() {}

  @Get()
  async getBusinesses() {}

  @Put('/:id')
  async updateBusiness() {}

  @Delete('/:id')
  async deleteBusiness() {}

  @Post('/user')
  @UseGuards(AdminsGuard)
  async addUserToBusiness(@Body() body: AddUserToBusiness): Promise<string> {
    try {
      return await this.businessesService.addUserToBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {}
  }

  @Delete('/user')
  async deleteUserFromBusiness() {}
}
