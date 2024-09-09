import { Business } from '../../businesses/business.entity';
import { Role, User } from '../../users/entities';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
