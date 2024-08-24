import { Injectable } from '@nestjs/common';
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

  async findAllUserRoles(userId: number): Promise<Roles[]> {
    try {
      const userBusinessRoles = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusinessRole')
        .where('userBusinessRole.userId = :userId', { userId })
        .getMany();

      const userRoles = userBusinessRoles.map((ubr) => ({
        roleId: ubr.role.id,
        businessId: ubr.business.id,
      }));

      if (userRoles.length) return userRoles;

      return [{ roleId: RolesIds.patient }];
    } catch (err) {
      throw err;
    }
  }
}
