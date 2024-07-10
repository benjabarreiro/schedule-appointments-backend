import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Module({
  exports: [EmployeesService],
  providers: [EmployeesService],
})
export class EmployeesModule {}
