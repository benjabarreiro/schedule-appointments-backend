import { Status } from 'src/enums';
import { Role } from './role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  birth_date: Date;

  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @Column()
  password: string;

  @Column()
  status: Status;
}
