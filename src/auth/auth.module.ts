import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailsModule } from 'src/emails/emails.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    UsersModule,
    EmailsModule,
    JwtModule,
    BusinessesModule,
    EmployeesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
