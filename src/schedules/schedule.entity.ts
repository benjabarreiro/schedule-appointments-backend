import { Business } from '../businesses/business.entity';
import { Employee } from '../employees/entities';
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

  @ManyToOne(() => Employee, (employee) => employee.schedules)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Business, (business) => business.schedules)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
