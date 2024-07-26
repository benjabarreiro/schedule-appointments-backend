import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [UsersModule, EmployeesModule, JwtModule],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
