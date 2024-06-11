import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../enums';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: Roles;
}
