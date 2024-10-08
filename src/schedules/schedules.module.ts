import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { SchedulesController } from './schedules.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { UserBusinessRoleModule } from 'src/user-business-role/user-business-role.module';

@Module({
  imports: [BusinessesModule, JwtModule, UsersModule, UserBusinessRoleModule],
  exports: [SchedulesService],
  providers: [SchedulesService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
