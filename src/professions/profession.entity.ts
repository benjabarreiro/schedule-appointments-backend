import { UserBusinessRoleProfession } from '../user-business-role/entities/user-business-role-profession.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profession')
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => UserBusinessRoleProfession,
    (userBusinessRoleProfession) => userBusinessRoleProfession.profession,
  )
  userBusinessRoleProfessions: UserBusinessRoleProfession[];
}
