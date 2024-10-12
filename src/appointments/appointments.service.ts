import { Connection, Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentsService {
  private appointmentsRepository: Repository<Appointment>;
  constructor(private readonly connection: Connection) {
    this.appointmentsRepository = connection.getRepository(Appointment);
  }

  async createAppointment(body) {
    try {
      await this.isAppointmentAlreadyTaken(body.scheduleId, body.dateTime);

      const newAppointment = await this.appointmentsRepository.create(body);

      return await this.appointmentsRepository.save(newAppointment);
    } catch (err) {
      throw err;
    }
  }

  async updateAppointment(id, body) {
    try {
      const appointment = await this.getAppointmentByIdOrThrow(id);

      await this.isAppointmentAlreadyTaken(body.scheduleId, body.dateTime);

      const updatedAppointment = { ...appointment, body };

      return await this.appointmentsRepository.save(updatedAppointment);
    } catch (err) {
      throw err;
    }
  }

  async cancelAppointment(id: number) {
    try {
      await this.getAppointmentByIdOrThrow(id);

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

  async getAppointmentByIdOrThrow(id) {
    try {
      const appointment = await this.getAppointmentById(id);
      if (!appointment)
        throw new HttpException(
          'There are no appointments with id ' + id,
          HttpStatus.NOT_FOUND,
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
}
