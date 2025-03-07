import { Plan } from '../plans/plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBusinessRole } from '../user-business-role/entities/user-business-role.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column()
  is_active: boolean;

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.business,
    { onDelete: 'CASCADE' },
  )
  userBusinessRoles: UserBusinessRole[];
}
