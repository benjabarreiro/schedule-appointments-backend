import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from './interfaces';
import { Connection, Repository } from 'typeorm';
import { UserBusinessRole } from './entities/user-business-role.entity';
import { RolesIds } from 'src/common/enums';

@Injectable()
export class UserBusinessRoleService {
  private userBusinessRoleRepository: Repository<UserBusinessRole>;
  constructor(private readonly connection: Connection) {
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
      await this.userBusinessRoleRepository.save(newUserBusinessRole);
    } catch (err) {
      throw new HttpException(
        'There was an error creating relation between admin and business',
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
      const employee = await this.userBusinessRoleRepository.findOne({
        where: {
          user: { id: userId },
          role: { id: roleId },
          business: { id: businessId },
        },
      });

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
}
