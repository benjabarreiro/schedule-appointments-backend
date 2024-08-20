import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.entity';
import { JoiValidationPipe } from 'src/common/pipes';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { createScheduleschema, updateScheduleschema } from './schemas';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { EmployeesGuard } from 'src/common/guards/employee.guard';
import { BusinessAdminGuard } from 'src/common/guards/business-admin';

@Controller('/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(IsAdminGuard, BusinessAdminGuard, EmployeesGuard)
  async createScheule(
    @Body(new JoiValidationPipe<CreateScheduleDto>(createScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.createSchedule(body);
  }

  @Put(':id')
  @UseGuards(IsAdminGuard, BusinessAdminGuard, EmployeesGuard)
  async updateSchedule(
    @Param('id') id,
    @Body(new JoiValidationPipe<UpdateScheduleDto>(updateScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.updateSchedule(id, body);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard, BusinessAdminGuard)
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
