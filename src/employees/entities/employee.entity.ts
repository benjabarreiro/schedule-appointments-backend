import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Schedule } from '../../schedules/schedule.entity';
import { Business } from '../../businesses/business.entity';
import { Exclude } from 'class-transformer';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Business, (business) => business.employees)
  @JoinTable({
    name: 'employee_business', // name of the junction table
    joinColumn: { name: 'employee_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_id', referencedColumnName: 'id' },
  })
  @Exclude()
  businesses: Business[];

  @OneToMany(() => Schedule, (schedule) => schedule.business)
  schedules: Schedule[];
}
