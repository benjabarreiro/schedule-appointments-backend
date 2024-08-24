import { Plan } from '../plans/plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../schedules/schedule.entity';
import { UserBusinessRole } from '../user-business-role/entities/user-business-role.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  admin_id: number;

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column()
  is_active: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.business)
  schedules: Schedule[];

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.business,
  )
  userBusinessRoles: UserBusinessRole[];
}
