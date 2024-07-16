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

@Controller('/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async createScheule(@Body() body): Promise<String> {
    return await this.schedulesService.createSchedule(body);
  }

  @Put(':id')
  async updateScheule(@Param('id') id, @Body() body): Promise<String> {
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
