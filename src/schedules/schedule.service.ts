import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dtos';
import { BusinessesService } from 'src/businesses/businesses.service';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class SchedulesService {
  private schedulesRepository: Repository<Schedule>;
  constructor(
    private readonly connection: Connection,
    private readonly businessesService: BusinessesService,
    private readonly employeesService: EmployeesService,
  ) {
    this.schedulesRepository = connection.getRepository(Schedule);
  }

  async createSchedule(body: CreateScheduleDto) {
    try {
      await this.businessesService.findBusinessById(body.businessId);
      await this.employeesService.findEmployeeById(body.employeeId);

      //TO DO: validate admin is creating this schedule
      //TO DO: validate he can create a new schedule with current plan
      const newSchedule = await this.schedulesRepository.create(body);
      await this.schedulesRepository.save(newSchedule);
    } catch (err) {
      throw err;
    }
  }

  async updateSchedule(body: UpdateScheduleDto) {}

  async deleteSchedule(id: number) {}

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
