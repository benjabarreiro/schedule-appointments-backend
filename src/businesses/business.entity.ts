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
import { Employee } from 'src/employees/entities';

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

  @ManyToMany(() => Employee, (employee) => employee.businesses)
  @Exclude()
  employees: Employee[];

  @OneToMany(() => Schedule, (schedule) => schedule.business)
  schedules: Schedule[];
}
