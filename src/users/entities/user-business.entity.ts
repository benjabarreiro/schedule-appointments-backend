import { Entity, PrimaryColumn } from 'typeorm';

@Entity('user_business')
export class UserBusiness {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  business_id: number;
}
