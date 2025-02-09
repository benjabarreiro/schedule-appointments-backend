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
@UseGuards(BusinessAdminGuard)
export class SchedulesController {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/:businessId')
  async createScheule(
    @RequestNest() req: Request,
    @Param('businessId') businessId,
    @Body(new JoiValidationPipe<CreateScheduleDto>(createScheduleschema)) body,
  ): Promise<String> {
    const jwt = this.jwtService.getJwt(req);
    const { roles } = this.jwtService.verifyToken(jwt);

    if (
      !roles.find(
        (role) =>
          role.id === body.ubrId && role.businessId === Number(businessId),
      )
    ) {
      throw new HttpException(
        'Employee does not belong to business',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.schedulesService.createSchedule(body);
  }

  @Put('/:businessId/:scheduleId')
  async updateSchedule(
    @Param('scheduleId') scheduleId,
    @Body(new JoiValidationPipe<UpdateScheduleDto>(updateScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.updateSchedule(Number(scheduleId), body);
  }

  @Delete('/:businessId/:scheduleId')
  async deleteScheule(@Param('scheduleId') scheduleId): Promise<String> {
    return await this.schedulesService.deleteSchedule(Number(scheduleId));
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

  @Get(':scheduleId')
  async findScheduleById(@Param('scheduleId') scheduleId): Promise<Schedule> {
    return await this.findScheduleById(Number(scheduleId));
  }
}
