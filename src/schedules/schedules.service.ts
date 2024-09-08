import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { BusinessesService } from 'src/businesses/businesses.service';
import { convertKeysToSnakeCase } from 'src/common/utils/parsers';

@Injectable()
export class SchedulesService {
  private schedulesRepository: Repository<Schedule>;
  constructor(
    private readonly connection: Connection,
    private readonly businessesService: BusinessesService, //private readonly employeesService: EmployeesService,
  ) {
    this.schedulesRepository = connection.getRepository(Schedule);
  }

  async createSchedule(body: CreateScheduleDto): Promise<string> {
    try {
      await this.businessesService.findBusinessById(body.businessId);
      //await this.employeesService.findEmployeeById(body.employeeId);

      const parsedBody = convertKeysToSnakeCase(body);

      //TO DO: validate admin is creating this schedule
      //TO DO: validate he can create a new schedule with current plan
      const newSchedule = await this.schedulesRepository.create(parsedBody);
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
}
