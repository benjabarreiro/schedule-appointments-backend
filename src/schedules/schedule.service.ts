import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class SchedulesService {
  private schedulesRepository: Repository<Schedule>;
  constructor(private readonly connection: Connection) {
    this.schedulesRepository = connection.getRepository(Schedule);
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
      return await this.schedulesRepository.findOne({ where: { id } });
    } catch (err) {
      throw new HttpException(
        'There was an error finding the schedule with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmployeeIdAndBusinessId(
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
