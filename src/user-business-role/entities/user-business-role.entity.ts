import { UserBusinessRole_Profession } from '../../employees/entities/user-business-role_profession.entity';
import { Business } from '../../businesses/business.entity';
import { Role, User } from '../../users/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    () => UserBusinessRole_Profession,
    (userBusinessRole_Profession) =>
      userBusinessRole_Profession.userBusinessRole,
    { eager: true },
  )
  userBusinessRole_Profession: UserBusinessRole_Profession;
}
