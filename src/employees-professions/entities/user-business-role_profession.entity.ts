import { UserBusinessRole } from '../../user-business-role/entities/user-business-role.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profession } from '../../professions/profession.entity';

@Entity('employees_profession')
export class UserBusinessRole_Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.userBusinessRole_Profession,
  )
  @JoinColumn({ name: 'user_business_role_id' })
  userBusinessRole: UserBusinessRole;

  @ManyToOne(
    () => Profession,
    (employeeProfession) => employeeProfession.userBusinessRole_Profession,
    { eager: true },
  )
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;
}
