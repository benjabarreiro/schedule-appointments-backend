import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { UserBusinessRole_Profession } from './entities/user-business-role_profession.entity';

@Injectable()
export class EmployeesProfessionsService {
  private employeesProfessionRepository: Repository<UserBusinessRole_Profession>;
  constructor(private readonly connection: Connection) {
    this.employeesProfessionRepository = this.connection.getRepository(
      UserBusinessRole_Profession,
    );
  }

  async getEmployeeProfession(userBusinessRoleId: number) {
    try {
      return await this.employeesProfessionRepository.findOne({
        where: { id: userBusinessRoleId },
      });
    } catch (err) {
      throw err;
    }
  }

  async getAllEmployeeProfession(employeeId: number) {
    try {
      return await this.employeesProfessionRepository.find({
        where: {
          userBusinessRole: { user: { id: employeeId }, role: { id: 2 } },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getAllEmployeesProfessions() {
    try {
      return await this.employeesProfessionRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async getAllEmployeesByProfession(professionId: number) {
    try {
      return await this.employeesProfessionRepository.find({
        where: { profession: { id: professionId } },
      });
    } catch (err) {
      throw err;
    }
  }

  async addEmployeeProfession(body: any) {
    try {
      const newEmployeeProfession = this.employeesProfessionRepository.create({
        userBusinessRole: body.userBusinessRoleId,
        profession: body.professionId,
      });

      return await this.employeesProfessionRepository.save(
        newEmployeeProfession,
      );
    } catch (err) {
      throw err;
    }
  }

  async editEmployeeProfession(id: number, body: any) {
    try {
      const employeeProfession = await this.getEmployeeProfession(id);
      const editedEmployeeProfessionBody = { ...employeeProfession, ...body };
      return this.employeesProfessionRepository.save(
        editedEmployeeProfessionBody,
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteEmployeeProfession(id: number) {
    try {
      return await this.employeesProfessionRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
