import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { MiddlewareBuilder } from '@nestjs/core';
import { UsersMiddleware } from './users.middleware';

@Module({
  imports: [JwtModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareBuilder) {
    consumer.apply(UsersMiddleware).forRoutes(UsersController);
  }
}
