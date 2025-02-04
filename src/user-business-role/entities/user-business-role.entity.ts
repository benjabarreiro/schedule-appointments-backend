import { Business } from '../../businesses/business.entity';
import { Role, User } from '../../users/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBusinessRoleProfession } from './user-business-role-profession.entity';
import { Schedule } from 'src/schedules/schedule.entity';

@Entity()
export class UserBusinessRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBusinessRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.userBusinessRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Role, (role) => role.userBusinessRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(
    () => UserBusinessRoleProfession,
    (userBusinessRoleProfession) => userBusinessRoleProfession.userBusinessRole,
  )
  userBusinessRoleProfessions: UserBusinessRoleProfession[];

  @OneToMany(() => Schedule, (schedules) => schedules.employee)
  schedules: Schedule[];
}
