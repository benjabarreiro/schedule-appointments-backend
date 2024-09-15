import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBusinessRole_Profession } from './user-business-role_profession.entity';

@Entity('profession')
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => UserBusinessRole_Profession,
    (userBusinessRole_Profession) => userBusinessRole_Profession.profession,
  )
  userBusinessRole_Profession: UserBusinessRole_Profession[];
}
