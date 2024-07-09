import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { PlanDto } from './dtos';

@Injectable()
export class PlansService {
  private plansRepository: Repository<Plan>;
  constructor(private readonly connection: Connection) {
    this.plansRepository = this.connection.getRepository(Plan);
  }

  async findAll(): Promise<PlanDto[]> {
    try {
      return await this.plansRepository.find();
    } catch (err) {
      throw new HttpException(
        'There was an error getting plans from the DB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
