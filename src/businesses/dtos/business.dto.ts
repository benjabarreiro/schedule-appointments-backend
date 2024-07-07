import { PlanDto } from '../../plans/dtos';

export class BusinessDto {
  id: number;
  name: string;
  adminId: number;
  plan: PlanDto;
  isActive: boolean;
}
