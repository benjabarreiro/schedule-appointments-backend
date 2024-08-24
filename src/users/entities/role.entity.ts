import { UserBusinessRole } from '../../user-business-role/entities/user-business-role.entity';
import { Roles } from '../../common/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Roles })
  name: Roles;

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.role,
  )
  userBusinessRoles: UserBusinessRole[];
}
