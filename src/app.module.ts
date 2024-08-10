import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersController } from './users/users.controller';
import { Role, User } from './users/entities';
import { Plan } from './plans/plan.entity';
import { PlansModule } from './plans/plans.module';
import { Business } from './businesses/business.entity';
import { BusinessesModule } from './businesses/businesses.module';
import { Schedule } from './schedules/schedule.entity';
import { Employee, EmployeeBusiness } from './employees/entities';
import { EmployeesModule } from './employees/employees.module';
import { SchedulesModule } from './schedules/schedules.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    JwtModule,
    UsersModule,
    PlansModule,
    BusinessesModule,
    EmployeesModule,
    SchedulesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Role,
          Plan,
          Business,
          Employee,
          EmployeeBusiness,
          Schedule,
        ],
        synchronize: false,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: true, // Automatically run migrations on app startup
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Plan,
      Business,
      Employee,
      EmployeeBusiness,
      Schedule,
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
