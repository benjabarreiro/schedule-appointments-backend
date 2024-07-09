import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  private transporter: nodemailer.Transporter;
  private readonly host: string;
  private readonly port: number;
  private readonly secure: boolean;
  private readonly user: string;
  private readonly pass: string;

  constructor(private readonly configService: ConfigService) {
    this.host = this.configService.get<string>('email.host');
    this.port = this.configService.get<number>('email.port');
    this.secure = this.configService.get('email.secure') === 'true';
    this.user = this.configService.get<string>('email.user');
    this.pass = this.configService.get<string>('email.pass');

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        to,
        subject,
        text,
      });
    } catch (err) {
      throw new HttpException(
        'There was an error sending the email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
