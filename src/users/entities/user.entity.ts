import { Appointment } from '../../appointments/appointment.entity';
import { UserBusinessRole } from '../../user-business-role/entities/user-business-role.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column()
  password: string;

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.user,
    { onDelete: 'CASCADE' },
  )
  userBusinessRoles: UserBusinessRole[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
