import { Module } from '@nestjs/common';
import { ProfessionsService } from './profession.service';
import { ProfessionsController } from './profession.controller';

@Module({
  imports: [],
  exports: [],
  providers: [ProfessionsService],
  controllers: [ProfessionsController],
})
export class ProfessionsModule {}
