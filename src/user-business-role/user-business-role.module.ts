import { Module } from '@nestjs/common';
import { UserBusinessRoleService } from './user-business-role.service';

@Module({
  providers: [UserBusinessRoleService],
  exports: [UserBusinessRoleService],
})
export class UserBusinessRoleModule {}
