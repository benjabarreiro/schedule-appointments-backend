import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { EmployeesModule } from 'src/employees/employees.module';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { SchedulesController } from './schedules.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [EmployeesModule, BusinessesModule, JwtModule, UsersModule],
  exports: [SchedulesService],
  providers: [SchedulesService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
