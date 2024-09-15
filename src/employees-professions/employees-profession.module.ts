import { Module } from '@nestjs/common';
import { EmployeesProfessionsService } from './employees-profession.service';

@Module({
  providers: [EmployeesProfessionsService],
  controllers: [],
  imports: [],
  exports: [],
})
export class EmployeesProfessionModule {}
