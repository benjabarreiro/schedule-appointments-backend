import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [SchedulesModule, JwtModule],
})
export class AppointmentsModule {}
