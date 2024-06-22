import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Replace with your SMTP server host
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Your email
        pass: 'your-email-password', // Your email password
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'barreirobenjamin@gmail.com>',
        to,
        subject,
        text,
      });

      console.log('Message sent: %s', info.messageId);
    } catch (err) {
      throw new HttpException(
        'There was an error sending the email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
