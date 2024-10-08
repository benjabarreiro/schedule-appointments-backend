import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserBusinessRoleModule } from 'src/user-business-role/user-business-role.module';

@Module({
  imports: [UsersModule, JwtModule, UserBusinessRoleModule],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
