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
import { AdminsGuard } from 'src/common/guards/admin.guard';
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';
import { JoiValidationPipe } from 'src/common/pipes';
import { createBusinessSchema } from './schemas/create-business.schema';
import { UpdateBusinessDto } from './dtos/update.dto';
import { updateBusinessSchema } from './schemas/update-buiness.schema';

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
  @UseGuards(AdminsGuard)
  async updateBusiness(
    @Param('id') id: string,
    @Body(new JoiValidationPipe<UpdateBusinessDto>(updateBusinessSchema))
    body: UpdateBusinessDto,
  ) {
    try {
      return await this.businessesService.updateBusiness(body, Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:id')
  @UseGuards(AdminsGuard)
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
  @UseGuards(AdminsGuard)
  async deleteUserFromBusiness() {}
}
