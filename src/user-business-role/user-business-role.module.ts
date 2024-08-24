import { Module } from '@nestjs/common';
import { UserBusinessRoleService } from './user-business-role.service';

@Module({
  exports: [UserBusinessRoleService],
})
export class UserBusinessRoleModule {}
