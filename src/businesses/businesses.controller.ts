import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request as RequestNest,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { AddUserToBusiness, CreateBusinessDto } from './dtos';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';
import { JoiValidationPipe } from 'src/common/pipes';
import { createBusinessSchema } from './schemas/create-business.schema';
import { UpdateBusinessDto } from './dtos/update.dto';
import { updateBusinessSchema } from './schemas/update-buiness.schema';
import { BusinessAdminGuard } from 'src/common/guards/business-admin';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly jwtService: JwtService,
  ) {}
  @Post()
  async createBusiness(
    @Body(new JoiValidationPipe<CreateBusinessDto>(createBusinessSchema))
    body: CreateBusinessDto,
    @RequestNest() req: Request,
  ): Promise<string> {
    try {
      const jwt = this.jwtService.getJwt(req);
      const { id: userId } = this.jwtService.verifyToken(jwt);

      const business = await this.businessesService.findBusinessByAdminId(
        userId,
        true,
      );

      if (business)
        throw new HttpException(
          'User already has a business',
          HttpStatus.CONFLICT,
        );

      return await this.businessesService.createBusiness(body, userId);
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  async getBusiness() {}

  @Get()
  async getBusinesses() {}

  @Put('/:id')
  @UseGuards(IsAdminGuard, BusinessAdminGuard)
  async updateBusiness(
    @Param('id') id: string,
    @Body(new JoiValidationPipe<UpdateBusinessDto>(updateBusinessSchema))
    body: UpdateBusinessDto,
  ): Promise<String> {
    try {
      return await this.businessesService.updateBusiness(body, Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:id')
  @UseGuards(IsAdminGuard, BusinessAdminGuard)
  async deleteBusiness() {}

  @Post('/user')
  @UseGuards(IsAdminGuard, BusinessAdminGuard)
  async addUserToBusiness(@Body() body: AddUserToBusiness): Promise<string> {
    try {
      return await this.businessesService.addUserToBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete('/user')
  @UseGuards(IsAdminGuard, BusinessAdminGuard)
  async deleteUserFromBusiness() {}
}
