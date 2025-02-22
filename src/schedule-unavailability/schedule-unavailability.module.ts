import { Module } from '@nestjs/common';
import { ScheduleUnavailabilityController } from './schedule-unavailability.controller';
import { ScheduleUnavailabilityService } from './schedule-unavailability.service';

@Module({
  controllers: [ScheduleUnavailabilityController],
  providers: [ScheduleUnavailabilityService],
  exports: [ScheduleUnavailabilityService],
})
export class ScheduleUnavailabilityModule {}
