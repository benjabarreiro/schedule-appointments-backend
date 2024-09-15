import { Module } from '@nestjs/common';
import { ProfessionsService } from './profession.service';

@Module({
  imports: [],
  exports: [],
  providers: [ProfessionsService],
  controllers: [],
})
export class ProfessionsModule {}
