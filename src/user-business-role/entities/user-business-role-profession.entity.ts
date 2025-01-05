import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { UserBusinessRole } from './user-business-role.entity';
import { Profession } from '../../professions/profession.entity';

@Entity('user_business_role_profession')
export class UserBusinessRoleProfession {
  @PrimaryColumn()
  userBusinessRoleId: number;

  @PrimaryColumn()
  professionId: number;

  @ManyToOne(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.userBusinessRoleProfessions,
    {
      onDelete: 'CASCADE',
    },
  )
  userBusinessRole: UserBusinessRole;

  @ManyToOne(
    () => Profession,
    (profession) => profession.userBusinessRoleProfessions,
  )
  profession: Profession;
}
