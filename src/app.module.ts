import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { SchedulesModule } from './schedules/schedules.module';
import { JwtModule } from './jwt/jwt.module';
import { BusinessesController } from './businesses/businesses.controller';
import { UserBusinessRole } from './user-business-role/entities/user-business-role.entity';
import { Profession } from './professions/profession.entity';
import { EmployeesProfessionModule } from './employees-professions/employees-profession.module';
import { ProfessionsModule } from './professions/profession.module';
import { UserBusinessRoleProfession } from './user-business-role/entities/user-business-role-profession.entity';
import { Appointment } from './appointments/appointment.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { SchedulesController } from './schedules/schedules.controller';
import { AppointmentsController } from './appointments/appointments.controller';
import { UserBusinessRoleController } from './user-business-role/user-business-role.controller';
import { EmptyBodyMiddleware } from './common/middlewares/empty-body.middleware';
import { ScheduleUnavailability } from './schedule-unavailability/schedule-unavailability.entity';
import { ScheduleUnavailabilityModule } from './schedule-unavailability/schedule-unavailability.module';

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
    SchedulesModule,
    ScheduleUnavailabilityModule,
    EmployeesProfessionModule,
    ProfessionsModule,
    AppointmentsModule,
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
          Schedule,
          ScheduleUnavailability,
          UserBusinessRole,
          Profession,
          UserBusinessRoleProfession,
          Appointment,
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
      Schedule,
      ScheduleUnavailability,
      UserBusinessRole,
      Profession,
      UserBusinessRoleProfession,
      Appointment,
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        UsersController,
        BusinessesController,
        SchedulesController,
        AppointmentsController,
        UserBusinessRoleController,
      );
    consumer
      .apply(EmptyBodyMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.POST },
        { path: '*', method: RequestMethod.PUT },
      );
  }
}
