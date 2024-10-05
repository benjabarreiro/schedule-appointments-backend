import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeesProfessionsService } from './employees-profession.service';

@Controller('employees-profession')
export class EmployeesProfessionsController {
  constructor(
    private readonly employeesProfessionsService: EmployeesProfessionsService,
  ) {}

  @Post()
  async addEmployeeProfession(body) {
    try {
      return await this.employeesProfessionsService.addEmployeeProfession(
        body.userBusinessRoleId,
        body.professionId,
      );
    } catch (err) {
      throw err;
    }
  }
  @Put('/:userBusinessRoleId/:professionId')
  async editEmployeeProfession(
    @Param('userBusinessRoleId') userBusinessRoleId,
    @Param('professionId') professionId,
    @Body() body,
  ) {
    try {
      return await this.employeesProfessionsService.editEmployeeProfession(
        Number(userBusinessRoleId),
        Number(professionId),
        body,
      );
    } catch (err) {
      throw err;
    }
  }
  @Delete('/:userBusinessRoleId/:professionId')
  async deleteEmployeeProfession(
    @Param('userBusinessRoleId') userBusinessRoleId,
    @Param('professionId') professionId,
  ) {
    try {
      return await this.employeesProfessionsService.deleteEmployeeProfession(
        Number(userBusinessRoleId),
        Number(professionId),
      );
    } catch (err) {
      throw err;
    }
  }

  @Get('/:professionId')
  async getAllEmployeesByProfession(@Param('professionId') professionId) {
    try {
      return await this.employeesProfessionsService.getAllEmployeesByProfession(
        Number(professionId),
      );
    } catch (err) {
      throw err;
    }
  }
}
