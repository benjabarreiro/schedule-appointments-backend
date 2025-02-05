import { Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { MiddlewareBuilder } from '@nestjs/core';
import { UsersMiddleware } from './users.middleware';
import { EmptyBodyMiddleware } from 'src/common/middlewares/empty-body.middleware';

@Module({
  imports: [JwtModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareBuilder) {
    consumer.apply(UsersMiddleware).forRoutes(UsersController);
    consumer
      .apply(EmptyBodyMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.POST },
        { path: '*', method: RequestMethod.PUT },
      );
  }
}
