import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from './interfaces';
import { Connection, Repository } from 'typeorm';
import { UserBusinessRole } from './entities/user-business-role.entity';
import { RolesIds } from 'src/common/enums';
import { EmployeesProfessionsService } from 'src/employees-professions/employees-profession.service';

@Injectable()
export class UserBusinessRoleService {
  private userBusinessRoleRepository: Repository<UserBusinessRole>;
  constructor(
    private readonly connection: Connection,
    private readonly employeesProfessionsService: EmployeesProfessionsService,
  ) {
    this.userBusinessRoleRepository =
      this.connection.getRepository(UserBusinessRole);
  }

  async createUserBusinessRoleRelation(
    userId: number,
    businessId: number,
    roleId: number,
  ) {
    try {
      const newUserBusinessRole = await this.userBusinessRoleRepository.create({
        user: { id: userId },
        business: { id: businessId },
        role: { id: roleId },
      });
      return await this.userBusinessRoleRepository.save(newUserBusinessRole);
    } catch (err) {
      throw new HttpException(
        'There was an error creating relation between admin and business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserBusinessRoleRelation(id: number) {
    try {
      return await this.userBusinessRoleRepository.delete(id);
    } catch (err) {
      if (err.status === 404) throw err;
      throw new HttpException(
        `There was an error deleting relation with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUserRoles(userId: number): Promise<Roles[]> {
    try {
      const userBusinessRoles = await this.userBusinessRoleRepository
        .createQueryBuilder('user_business_role')
        .leftJoinAndSelect('user_business_role.user', 'user')
        .leftJoinAndSelect('user_business_role.business', 'business')
        .leftJoinAndSelect('user_business_role.role', 'role')
        .where('user_business_role.user_id = :userId', { userId })
        .getMany();

      const userRoles = userBusinessRoles.map((ubr) => ({
        roleId: ubr.role.id,
        businessId: ubr.business.id,
        userId: ubr.user.id,
      }));

      if (userRoles.length) return userRoles;

      return [{ roleId: RolesIds.patient }];
    } catch (err) {
      throw err;
    }
  }

  async findEmployeeInBusiness(
    userId,
    businessId,
    roleId,
    validation = true,
  ): Promise<UserBusinessRole> {
    try {
      const employee = await this.userBusinessRoleRepository
        .createQueryBuilder('user_business_role')
        .leftJoinAndSelect('user_business_role.user', 'user')
        .leftJoinAndSelect('user_business_role.business', 'business')
        .leftJoinAndSelect('user_business_role.role', 'role')
        .where('user_business_role.user_id = :userId', { userId })
        .andWhere('user_business_role.business_id = :businessId', {
          businessId,
        })
        .andWhere('user_business_role.role_id = :roleId', { roleId })
        .getOne();

      if (!employee && validation)
        throw new HttpException(
          `Business with id ${businessId} does not have an employee with id ${userId}`,
          HttpStatus.NOT_FOUND,
        );

      return employee;
    } catch (err) {
      throw err;
    }
  }

  async findBusinessByAdminId(adminId: number): Promise<UserBusinessRole> {
    try {
      return await this.userBusinessRoleRepository.findOne({
        where: { user: { id: adminId }, role: { id: RolesIds.admin } },
      });
    } catch (err) {
      throw err;
    }
  }

  async addUserToBusiness(
    userId: number,
    businessId: number,
    professionId?: number,
  ): Promise<string> {
    try {
      const employee = await this.findEmployeeInBusiness(
        userId,
        businessId,
        2,
        false,
      );

      if (employee) {
        throw new HttpException(
          'User is already an employee in the business',
          HttpStatus.CONFLICT,
        );
      }

      const userBusinessRole = await this.createUserBusinessRoleRelation(
        userId,
        businessId,
        2,
      );

      // this is okey
      if (professionId)
        await this.employeesProfessionsService.addEmployeeProfession(
          userBusinessRole.id,
          professionId,
        );

      return `Succesfully added user with id ${userId} to business with id ${businessId}`;
    } catch (err) {
      if (err.status === 404 || err.status === 500 || err.status === 409)
        throw err;
      throw new HttpException(
        `There was an error adding user with id ${userId} to business with id ${businessId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUserFromBusiness(userId: number, businessId: number) {
    try {
      const employee = await this.findEmployeeInBusiness(userId, businessId, 2);

      await this.deleteUserBusinessRoleRelation(employee.id);
      return `Succesfully deleted ${employee.user.first_name} ${employee.user.last_name} from business with id ${businessId}`;
    } catch (err) {
      if (err.status === 404 || err.status === 500) throw err;
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
