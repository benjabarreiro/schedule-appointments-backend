import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Business } from 'src/businesses/business.entity';

@Entity('user_business')
export class UserBusiness {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  business_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.id)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
