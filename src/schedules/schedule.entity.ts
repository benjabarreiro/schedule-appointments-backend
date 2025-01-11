import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { UserBusinessRole } from '../user-business-role/entities/user-business-role.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => UserBusinessRole, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: UserBusinessRole;

  @OneToMany(() => Appointment, (appointment) => appointment.schedule)
  appointments: Appointment[];

  @Column()
  is_active: boolean;
}
