import { Business } from 'src/businesses/business.entity';
import { Role } from '../entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  password: string;

  @ManyToMany(() => Business, (business) => business.users)
  @JoinTable({
    name: 'user_business', // name of the junction table
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_id', referencedColumnName: 'id' },
  })
  @Exclude()
  businesses: Business[];
}
