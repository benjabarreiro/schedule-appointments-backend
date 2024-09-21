import { Module } from '@nestjs/common';
import { UserBusinessRoleService } from './user-business-role.service';
import { UserBusinessRoleController } from './user-business-role.controller';
import { EmployeesProfessionModule } from 'src/employees-professions/employees-profession.module';

@Module({
  providers: [UserBusinessRoleService],
  exports: [UserBusinessRoleService],
  controllers: [UserBusinessRoleController],
  imports: [EmployeesProfessionModule],
})
export class UserBusinessRoleModule {}
