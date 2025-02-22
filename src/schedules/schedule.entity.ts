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
import { ScheduleUnavailability } from 'src/schedule-unavailability/schedule-unavailability.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => UserBusinessRole, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: UserBusinessRole;

  @OneToMany(() => Appointment, (appointment) => appointment.schedule)
  appointments: Appointment[];

  @Column()
  is_active: boolean;

  @Column()
  appointment_duration: number;

  @Column()
  shift_start_time: string;

  @Column()
  shift_end_time: string;

  @OneToMany(
    () => ScheduleUnavailability,
    (unavailability) => unavailability.schedule,
  )
  unavailabilities: ScheduleUnavailability[];
}
