import { Business } from '../../businesses/business.entity';
import { Role, User } from '../../users/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBusinessRoleProfession } from './user-business-role-profession';

@Entity()
export class UserBusinessRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBusinessRoles)
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
}
