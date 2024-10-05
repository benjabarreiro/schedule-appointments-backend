import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async createPlan(body) {
    try {
      return await this.plansService.createPlan(body);
    } catch (err) {
      throw err;
    }
  }
  @Put('/:id')
  async updatePlan(@Param('id') id, @Body() body) {
    try {
      return await this.plansService.updatePlan(Number(id), body);
    } catch (err) {
      throw err;
    }
  }
  @Delete('/:id')
  async deletePlan(@Param('id') id) {
    try {
      return await this.plansService.deletePlan(Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getAllPlans() {
    try {
      return await this.plansService.findAll();
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  async getPlanById(@Param('id') id) {
    try {
      return await this.plansService.findPlanById(Number(id));
    } catch (err) {
      throw err;
    }
  }
}
