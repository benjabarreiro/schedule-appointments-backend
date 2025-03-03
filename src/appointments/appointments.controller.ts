import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request as RequestNest,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Request } from 'express';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Post()
  async createAppointment(@Body() body) {
    try {
      return await this.appointmentsService.createAppointment(body);
    } catch (err) {
      throw err;
    }
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id,
    @Body() body,
    @RequestNest() req: Request,
  ) {
    try {
      const loggedUser = await this.appointmentsService.getLoggedUser(req);
      return await this.appointmentsService.updateAppointment(
        id,
        body,
        loggedUser,
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete(':id')
  async cancelAppointment(@Param('id') id, @RequestNest() req: Request) {
    try {
      const loggedUser = await this.appointmentsService.getLoggedUser(req);
      return await this.appointmentsService.cancelAppointment(id, loggedUser);
    } catch (err) {
      throw err;
    }
  }

  @Get('id')
  async getAppointmentById(@Param('id') id, @RequestNest() req: Request) {
    try {
      const loggedUser = await this.appointmentsService.getLoggedUser(req);
      return await this.appointmentsService.getAppointmentByIdOrThrow(
        id,
        loggedUser,
      );
    } catch (err) {
      throw err;
    }
  }
}
