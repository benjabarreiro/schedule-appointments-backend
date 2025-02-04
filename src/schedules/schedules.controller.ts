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
  Query,
  Request as RequestNest,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.entity';
import { JoiValidationPipe } from 'src/common/pipes';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { createScheduleschema, updateScheduleschema } from './schemas';
import { BusinessAdminGuard } from 'src/common/guards/business-admin.guard';
import { JwtService } from 'src/jwt/jwt.service';
import { Request } from 'express';

@Controller('/schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  //@UseGuards(BusinessAdminGuard)
  async createScheule(
    @RequestNest() req: Request,
    @Body(new JoiValidationPipe<CreateScheduleDto>(createScheduleschema)) body,
  ): Promise<String> {
    const jwt = this.jwtService.getJwt(req);
    const { roles } = this.jwtService.verifyToken(jwt);

    if (!roles.find((role) => role.id === body.ubrId)) {
      throw new HttpException(
        'Employee does not belong to business',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.schedulesService.createSchedule(body);
  }

  @Put(':id')
  //@UseGuards(BusinessAdminGuard)
  async updateSchedule(
    @Param('id') id,
    @Body(new JoiValidationPipe<UpdateScheduleDto>(updateScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.updateSchedule(id, body);
  }

  @Delete(':id')
  //@UseGuards(BusinessAdminGuard)
  async deleteScheule(@Param('id') id): Promise<String> {
    return await this.schedulesService.deleteSchedule(id);
  }

  @Get()
  async findSchedules(
    @Query('employeeid') employeeId: number,
    @Query('businessId') businessId: number,
  ): Promise<Schedule[]> {
    if (employeeId || businessId) {
      return await this.schedulesService.findScheduleByEmployeeIdAndBusinessId(
        employeeId,
        businessId,
      );
    }

    return await this.schedulesService.findAllSchedules();
  }

  @Get(':id')
  async findScheduleById(@Param('id') id): Promise<Schedule> {
    return await this.findScheduleById(id);
  }
}
