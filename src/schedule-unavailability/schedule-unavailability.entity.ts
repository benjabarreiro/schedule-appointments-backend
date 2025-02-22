import { Schedule } from 'src/schedules/schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedule-unavailability')
export class ScheduleUnavailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unavailability_start_datetime: string;

  @Column()
  unavailability_end_datetime: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.unavailabilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
