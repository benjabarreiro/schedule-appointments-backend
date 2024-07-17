import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.entity';
import { JoiValidationPie } from 'src/common/pipes';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { createScheduleschema, updateScheduleschema } from './schemas';

@Controller('/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async createScheule(
    @Body(new JoiValidationPie<CreateScheduleDto>(createScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.createSchedule(body);
  }

  @Put(':id')
  async updateScheule(
    @Param('id') id,
    @Body(new JoiValidationPie<UpdateScheduleDto>(updateScheduleschema)) body,
  ): Promise<String> {
    return await this.schedulesService.updateSchedule(id, body);
  }

  @Delete(':id')
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
