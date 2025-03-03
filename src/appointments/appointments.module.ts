import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [SchedulesModule],
})
export class AppointmentsModule {}
