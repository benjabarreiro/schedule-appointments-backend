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

  async createPlan(body) {
    try {
      const newPlan = await this.plansRepository.create(body);
      return await this.plansRepository.save(newPlan);
    } catch (err) {
      throw err;
    }
  }

  async updatePlan(id, body) {
    try {
      const plan = await this.findPlanById(id);
      return await this.plansRepository.save({ ...plan, ...body });
    } catch (err) {
      throw err;
    }
  }

  async deletePlan(id) {
    try {
      return await this.plansRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }

  async findPlanById(id: number) {
    return await this.plansRepository.findOne({ where: { id } });
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
