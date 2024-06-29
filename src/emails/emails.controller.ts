import { Body, Controller, Post } from '@nestjs/common';
import { EmailsService } from './email.servicie';

@Controller('/emails')
export class EmailsController {
  constructor(private emailService: EmailsService) {}

  // create endpoint for tests
  @Post()
  async sendEmail(@Body() body) {
    return await this.emailService.sendEmail(body.to, body.subject, body.text);
  }
}
