import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { SchedulesModule } from 'src/schedules/schedule.module';

@Module({
  exports: [EmployeesService],
  providers: [EmployeesService],
})
export class EmployeesModule {}
