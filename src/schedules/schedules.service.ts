import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { convertKeysToSnakeCase } from 'src/common/utils/parsers';
import { addMinutes, format, isEqual, parse } from 'date-fns';

@Injectable()
export class SchedulesService {
  private schedulesRepository: Repository<Schedule>;
  constructor(private readonly connection: Connection) {
    this.schedulesRepository = connection.getRepository(Schedule);
  }

  async createSchedule(body: CreateScheduleDto): Promise<string> {
    try {
      //const ubr = await this.userBusinessRoleService.findUbrById(body.ubrId);

      //TO DO: validate admin is creating this schedule
      //TO DO: validate he can create a new schedule with current plan
      const newSchedule = await this.schedulesRepository.create({
        name: body.name,
        description: body.description,
        employee: { id: body.ubrId },
        is_active: body.isActive,
        appointment_duration: body.appointmentDuration,
        shift_start_time: body.shiftStartTime,
        shift_end_time: body.shiftEndTime,
      });
      await this.schedulesRepository.save(newSchedule);

      return 'Schedule created succesfully';
    } catch (err) {
      throw err;
    }
  }

  async updateSchedule(id: number, body: UpdateScheduleDto): Promise<string> {
    try {
      const schedule = await this.findScheduleById(id);

      const parsedBody = convertKeysToSnakeCase(body);

      const updatedSchedule = { ...schedule, ...parsedBody };

      await this.schedulesRepository.save(updatedSchedule);

      return `Schedule with id ${id} was updated successfully`;
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating schedule with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSchedule(id: number): Promise<string> {
    try {
      await this.findScheduleById(id);
      await this.schedulesRepository.delete(id);

      return `Schedule with id ${id} was deleted succesfully`;
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error deleting schedule with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllSchedules(): Promise<Schedule[]> {
    try {
      return await this.schedulesRepository.find();
    } catch (err) {
      throw new HttpException(
        'There was an error finding all schedules',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findScheduleById(id: number): Promise<Schedule> {
    try {
      const schedule = await this.schedulesRepository.findOne({
        where: { id },
      });
      if (!schedule) {
        throw new HttpException(
          'There is no schedule with id ' + id,
          HttpStatus.NOT_FOUND,
        );
      }
      return schedule;
    } catch (err) {
      if (err.status === 404) throw err;
      throw new HttpException(
        'There was an error finding the schedule with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findScheduleByEmployeeIdAndBusinessId(
    employeeId?: number,
    businessId?: number,
  ): Promise<Schedule[]> {
    try {
      const queryBuilder =
        this.schedulesRepository.createQueryBuilder('schedules');

      if (employeeId) {
        queryBuilder.andWhere('schedules.employee_id = :employeeId', {
          employeeId,
        });
      }

      if (businessId) {
        queryBuilder.andWhere('schedules.business_id = :businessId', {
          businessId,
        });
      }

      return await queryBuilder.getMany();
    } catch (err) {
      let customeMessage = businessId ? ' by business id ' + businessId : '';
      customeMessage = employeeId
        ? `${customeMessage.length && ' and'} by employee id ${employeeId}`
        : customeMessage;
      throw new HttpException(
        'There was an error getting schedules' + customeMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkScheduleConfigurationOrThrow(
    scheduleId: number,
    appointmentDateTime: string,
  ) {
    const schedule = await this.findScheduleById(scheduleId);
    const appointmentTime = appointmentDateTime.split(' ')[1];

    //check unavailability range
    await this.checkScheduleUnavailability(
      schedule.unavailabilities,
      appointmentDateTime,
    );

    //check start_time
    await this.checkShiftStartTime(schedule.shift_start_time, appointmentTime);
    //check end_time
    await this.checkShiftEndTime(schedule.shift_end_time, appointmentTime);

    await this.checkScheduleDuration(
      schedule.appointment_duration,
      schedule.shift_start_time,
      schedule.shift_end_time,
      appointmentDateTime,
    );
  }

  async checkShiftStartTime(shiftStartTime: string, appointmentTime: string) {
    if (appointmentTime < shiftStartTime) {
      throw new HttpException(
        'Appointment time cannot be earlier than shift start time',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async checkShiftEndTime(shiftEndTime: string, appointmentTime: string) {
    if (appointmentTime > shiftEndTime) {
      throw new HttpException(
        'Appointment time cannot be later than shift end time',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkScheduleUnavailability(unavailabilities, appointmentDateTime) {
    if (!unavailabilities || !unavailabilities.length) return;

    unavailabilities.forEach((unavailability) => {
      if (
        appointmentDateTime >= unavailability.unavailability_start_datetime &&
        appointmentDateTime <= unavailability.unavailability_end_datetime
      ) {
        throw new HttpException(
          `Schedule is unavailable from ${unavailability.unavailability_start_datetime} to ${unavailability.unavailability_end_datetime}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  async checkScheduleDuration(
    duration: number,
    shiftStartTime: string,
    shiftEndTime: string,
    appointmentDateTime: string,
  ) {
    const appointmentDate = format(appointmentDateTime, 'yyyy-MM-dd');

    const start = parse(
      `${appointmentDate} ${shiftStartTime}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );
    const end = parse(
      `${appointmentDate} ${shiftEndTime}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );

    let current = start;
    const availableAppointments: Date[] = [];

    while (current < end) {
      availableAppointments.push(current);
      current = addMinutes(current, duration);
    }

    const isValid = availableAppointments.some((validSlot) =>
      isEqual(validSlot, appointmentDateTime),
    );

    if (!isValid) {
      throw new HttpException(
        'Invalid appointment time',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
