import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request as RequestNest,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dtos';
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';
import { JoiValidationPipe } from 'src/common/pipes';
import { createBusinessSchema } from './schemas/create-business.schema';
import { UpdateBusinessDto } from './dtos/update.dto';
import { updateBusinessSchema } from './schemas/update-buiness.schema';
import { BusinessAdminEmployeeGuard } from 'src/common/guards/business-admin-employee.guard';

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

      return await this.businessesService.createBusiness(body, userId);
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  async getBusiness(@Param('id') id) {
    try {
      return await this.businessesService.findBusinessById(Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getBusinesses() {
    try {
      return await this.businessesService.findAllBusinesses();
    } catch (err) {
      throw err;
    }
  }

  @Put('/:businessId')
  @UseGuards(BusinessAdminEmployeeGuard)
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body(new JoiValidationPipe<UpdateBusinessDto>(updateBusinessSchema))
    body: UpdateBusinessDto,
  ): Promise<String> {
    try {
      return await this.businessesService.updateBusiness(
        body,
        Number(businessId),
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:businessId')
  @UseGuards(BusinessAdminEmployeeGuard)
  async deleteBusiness(
    @Param('businessId') businessId: string,
  ): Promise<String> {
    try {
      return await this.businessesService.deleteBusiness(Number(businessId));
    } catch (err) {
      throw err;
    }
  }
}
