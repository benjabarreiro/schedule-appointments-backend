import { User } from '../users/entities';
import { Plan } from '../plans/plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Schedule } from '../schedules/schedule.entity';

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

  @ManyToMany(() => User, (user) => user.businesses)
  @Exclude()
  users: User[];

  @OneToMany(() => Schedule, (schedule) => schedule.business)
  schedules: Schedule[];
}
