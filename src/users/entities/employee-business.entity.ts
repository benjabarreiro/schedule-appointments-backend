import { Entity, PrimaryColumn } from 'typeorm';

@Entity('user_business')
export class EmployeeBusiness {
  @PrimaryColumn()
  employee_id: number;

  @PrimaryColumn()
  business_id: number;
}
