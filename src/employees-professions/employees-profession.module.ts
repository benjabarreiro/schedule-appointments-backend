import { Module } from '@nestjs/common';
import { EmployeesProfessionsService } from './employees-profession.service';
import { EmployeesProfessionsController } from './employees-profession.controller';

@Module({
  providers: [EmployeesProfessionsService],
  controllers: [EmployeesProfessionsController],
  imports: [],
  exports: [EmployeesProfessionsService],
})
export class EmployeesProfessionModule {}
