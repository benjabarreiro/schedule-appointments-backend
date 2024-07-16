import { Module } from '@nestjs/common';
import { SchedulesService } from './schedule.service';
import { EmployeesModule } from 'src/employees/employees.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  imports: [EmployeesModule, BusinessesModule],
  exports: [SchedulesService],
  providers: [SchedulesService],
})
export class SchedulesModule {}
