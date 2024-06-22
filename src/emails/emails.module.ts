import { Module } from '@nestjs/common';
import { EmailsService } from './email.servicie';
import { EmailsController } from './emails.controller';

@Module({
  exports: [EmailsService],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
