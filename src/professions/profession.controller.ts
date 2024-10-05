import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfessionsService } from './profession.service';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post()
  async createPlan(body) {
    try {
      return await this.professionsService.createProfession(body);
    } catch (err) {
      throw err;
    }
  }
  @Put('/:id')
  async updatePlan(@Param('id') id, @Body() body) {
    try {
      return await this.professionsService.editProfession(Number(id), body);
    } catch (err) {
      throw err;
    }
  }
  @Delete('/:id')
  async deletePlan(@Param('id') id) {
    try {
      return await this.professionsService.deleteProfession(Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getAllPlans() {
    try {
      return await this.professionsService.getAllProfessions();
    } catch (err) {
      throw err;
    }
  }
}
