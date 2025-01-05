import { Schedule } from '../schedules/schedule.entity';
import { User } from '../users/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateTime: string;

  // Relation to User entity
  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation to Schedule entity
  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column()
  status: string;
}
