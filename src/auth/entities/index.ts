import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../enums';

@Entity()
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
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: Roles;
}
