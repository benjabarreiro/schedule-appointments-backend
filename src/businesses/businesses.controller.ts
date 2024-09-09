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
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';
import { JoiValidationPipe } from 'src/common/pipes';
import { createBusinessSchema } from './schemas/create-business.schema';
import { UpdateBusinessDto } from './dtos/update.dto';
import { updateBusinessSchema } from './schemas/update-buiness.schema';
import { BusinessAdminGuard } from 'src/common/guards/business-admin.guard';
import { UserBusinessRoleService } from 'src/user-business-role/user-business-role.service';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly jwtService: JwtService,
    private readonly userBusinessRoleService: UserBusinessRoleService,
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

      const response = await this.userBusinessRoleService.findBusinessByAdminId(
        userId,
      );

      if (response)
        throw new HttpException(
          'User already has a business',
          HttpStatus.CONFLICT,
        );

      return await this.businessesService.createBusiness(body, userId);
    } catch (err) {
      throw err;
    }
  }

  @Post('/user')
  @UseGuards(BusinessAdminGuard)
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
  @UseGuards(BusinessAdminGuard)
  async removeUserFromBusiness(
    @Body() body: AddUserToBusiness,
  ): Promise<string> {
    try {
      return await this.businessesService.removeUserFromBusiness(
        body.userId,
        body.businessId,
      );
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  async getBusiness() {}

  @Get()
  async getBusinesses() {}

  @Put('/:id')
  @UseGuards(BusinessAdminGuard)
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
  @UseGuards(BusinessAdminGuard)
  async deleteBusiness(@Param('id') id: string) {
    try {
      return await this.businessesService.deleteBusiness(Number(id));
    } catch (err) {
      throw err;
    }
  }
}
