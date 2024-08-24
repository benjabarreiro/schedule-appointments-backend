import { User } from 'src/users/entities';
import { Business } from '../businesses/business.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @ManyToOne(() => Business, { nullable: false })
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
