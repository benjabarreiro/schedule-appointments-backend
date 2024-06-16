import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'azor_ahai',
      signOptions: { expiresIn: '1h' },
    }),
    UsersService,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
