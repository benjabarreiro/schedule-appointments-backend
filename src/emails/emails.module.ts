import { Module } from '@nestjs/common';
import { EmailsService } from './email.servicie';

@Module({
  exports: [EmailsService],
  providers: [EmailsService],
})
export class EmailsModule {}
