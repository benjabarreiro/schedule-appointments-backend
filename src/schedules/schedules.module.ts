import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { EmployeesModule } from 'src/employees/employees.module';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [EmployeesModule, BusinessesModule],
  exports: [SchedulesService],
  providers: [SchedulesService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}