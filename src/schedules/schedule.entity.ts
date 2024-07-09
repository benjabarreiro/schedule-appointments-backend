import { Business } from 'src/businesses/business.entity';
import { User } from 'src/users/entities';
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

  @ManyToOne(() => User, (user) => user.schedules, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @ManyToOne(() => Business, (business) => business.schedules)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
