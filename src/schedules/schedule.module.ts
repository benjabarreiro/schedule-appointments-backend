import { Module } from '@nestjs/common';
import { SchedulesService } from './schedule.service';

@Module({
  exports: [SchedulesService],
  providers: [SchedulesService],
})
export class SchedulesModule {}
