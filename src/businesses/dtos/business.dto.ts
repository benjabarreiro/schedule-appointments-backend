import { Plan } from 'src/plans/plan.entity';

export class BusinessDto {
  id: number;
  name: string;
  adminId: number;
  plan: Plan;
  isActive: boolean;
}
