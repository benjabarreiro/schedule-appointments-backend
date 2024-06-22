import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'azor_ahai',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    EmailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
