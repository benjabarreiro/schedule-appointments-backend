import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(body) {
    try {
      return await this.appointmentsService.createAppointment(body);
    } catch (err) {
      throw err;
    }
  }

  @Put(':id')
  async updateAppointment(@Param('id') id, @Body() body) {
    try {
      return await this.appointmentsService.updateAppointment(id, body);
    } catch (err) {
      throw err;
    }
  }

  @Delete(':id')
  async cancelAppointment(@Param('id') id) {
    try {
      return await this.appointmentsService.cancelAppointment(id);
    } catch (err) {
      throw err;
    }
  }

  @Get('id')
  async getAppointmentById(@Param('id') id) {
    try {
      return await this.appointmentsService.getAppointmentByIdOrThrow(id);
    } catch (err) {
      throw err;
    }
  }
}
