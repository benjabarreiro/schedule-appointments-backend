import { Injectable, NotFoundException } from '@nestjs/common';
import { UserBusinessRoleProfession } from 'src/user-business-role/entities/user-business-role-profession';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class EmployeesProfessionsService {
  private employeesProfessionRepository: Repository<UserBusinessRoleProfession>;
  constructor(private readonly connection: Connection) {
    this.employeesProfessionRepository = this.connection.getRepository(
      UserBusinessRoleProfession,
    );
  }

  async getEmployeeProfession(
    userBusinessRoleId: number,
    professionId: number,
  ) {
    try {
      return await this.employeesProfessionRepository.findOne({
        where: { userBusinessRoleId, professionId },
      });
    } catch (err) {
      throw err;
    }
  }

  async getAllProfessionsOfEmployee(employeeId: number) {
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
        where: { professionId },
      });
    } catch (err) {
      throw err;
    }
  }

  async addEmployeeProfession(body: any) {
    try {
      const newEmployeeProfession = this.employeesProfessionRepository.create({
        userBusinessRoleId: body.userBusinessRoleId,
        professionId: body.professionId,
      });

      return await this.employeesProfessionRepository.save(
        newEmployeeProfession,
      );
    } catch (err) {
      throw err;
    }
  }

  async editEmployeeProfession(
    userBusinessRoleId: number,
    professionId: number,
    body: Partial<Pick<UserBusinessRoleProfession, 'professionId'>>,
  ) {
    try {
      const existingRecord = await this.employeesProfessionRepository.findOne({
        where: { userBusinessRoleId, professionId },
      });

      if (!existingRecord) {
        throw new NotFoundException('UserBusinessRoleProfession not found');
      }

      existingRecord.professionId =
        body.professionId ?? existingRecord.professionId;

      return this.employeesProfessionRepository.save(existingRecord);
    } catch (err) {
      throw err;
    }
  }

  async deleteEmployeeProfession(
    userBusinessRoleId: number,
    professionId: number,
  ) {
    try {
      return await this.employeesProfessionRepository.delete({
        userBusinessRoleId,
        professionId,
      });
    } catch (err) {
      throw err;
    }
  }
}
