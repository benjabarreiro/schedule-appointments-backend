import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailsModule } from 'src/emails/emails.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserBusinessRoleModule } from 'src/user-business-role/user-business-role.module';

@Module({
  imports: [UsersModule, EmailsModule, JwtModule, UserBusinessRoleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
