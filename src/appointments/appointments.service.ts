import { Connection, Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SchedulesService } from 'src/schedules/schedules.service';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AppointmentsService {
  private appointmentsRepository: Repository<Appointment>;
  constructor(
    private readonly connection: Connection,
    private readonly schedulesService: SchedulesService,
    private readonly jwtService: JwtService,
  ) {
    this.appointmentsRepository = connection.getRepository(Appointment);
  }

  async createAppointment(body) {
    try {
      await this.isAppointmentAlreadyTaken(body.schedule, body.dateTime);

      await this.schedulesService.checkScheduleConfigurationOrThrow(
        body.schedule,
        body.dateTime,
      );

      const newAppointment = await this.appointmentsRepository.create(body);

      return await this.appointmentsRepository.save(newAppointment);
    } catch (err) {
      throw err;
    }
  }

  async updateAppointment(id, body, loggedUserData) {
    try {
      const appointment = await this.getAppointmentByIdOrThrow(
        id,
        loggedUserData,
      );

      await this.isAppointmentAlreadyTaken(body.scheduleId, body.dateTime);

      await this.schedulesService.checkScheduleConfigurationOrThrow(
        body.scheduleId,
        body.dateTime,
      );

      const updatedAppointment = { ...appointment, ...body };

      return await this.appointmentsRepository.save(updatedAppointment);
    } catch (err) {
      throw err;
    }
  }

  async cancelAppointment(id: number, loggedUserData) {
    try {
      await this.getAppointmentByIdOrThrow(id, loggedUserData);

      return this.appointmentsRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }

  async getAppointmentById(id: number) {
    try {
      return await this.appointmentsRepository.findOne({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async getAppointmentByDateTime(scheduleId, dateTime) {
    try {
      return await this.appointmentsRepository.findOne({
        where: { schedule: { id: scheduleId }, dateTime },
      });
    } catch (err) {
      throw err;
    }
  }

  async getAppointmentByIdOrThrow(id, loggedUserData) {
    try {
      const appointment = await this.getAppointmentById(id);
      if (!appointment)
        throw new HttpException(
          'There are no appointments with id ' + id,
          HttpStatus.NOT_FOUND,
        );

      await this.userCanDoAction(
        appointment.user.id,
        appointment.schedule.employee.business.id,
        loggedUserData,
      );
      return appointment;
    } catch (err) {
      throw err;
    }
  }
  async isAppointmentAlreadyTaken(scheduleId, dateTime) {
    try {
      const isAlreadyTaken = await this.getAppointmentByDateTime(
        scheduleId,
        dateTime,
      );

      if (isAlreadyTaken) {
        throw new HttpException(
          'Appointment already exists for dateTime',
          HttpStatus.BAD_REQUEST,
        );
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async userCanDoAction(userId: number, businessId, loggedUserData) {
    const { jwtUserId, roles } = loggedUserData;

    const isValidUser = userId === jwtUserId;
    const isValidEmployee = roles.some(
      (role) => role.businessId === businessId,
    );

    const isValidAction = isValidUser || isValidEmployee;

    if (!isValidAction) {
      throw new HttpException('Action not permitted', HttpStatus.FORBIDDEN);
    }
  }

  async getLoggedUser(req) {
    const jwt = this.jwtService.getJwt(req);
    const { id, roles } = this.jwtService.verifyToken(jwt);
    return { jwtUserId: Number(id), roles };
  }
}
