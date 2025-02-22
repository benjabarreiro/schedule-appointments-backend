import { Body, Controller, Param, Post } from '@nestjs/common';
import { ScheduleUnavailabilityService } from './schedule-unavailability.service';
import { JoiValidationPipe } from 'src/common/pipes';
import { CreateScheduleUnavailabilityDto } from './dtos/create-schedule-unavailability.dto';
import { createScheduleUnavailabilitySchema } from './schemas/create-schedule-unavailability.schema';

@Controller('schedule-unavailability')
export class ScheduleUnavailabilityController {
  constructor(
    private readonly scheduleUnavailabilityService: ScheduleUnavailabilityService,
  ) {}

  @Post(':scheduleId')
  async createScheduleUnavailability(
    @Param('scheduleId') scheduleId,
    @Body(
      new JoiValidationPipe<CreateScheduleUnavailabilityDto>(
        createScheduleUnavailabilitySchema,
      ),
    )
    body,
  ) {
    return this.scheduleUnavailabilityService.createScheduleUnavailability(
      Number(scheduleId),
      body,
    );
  }
}
