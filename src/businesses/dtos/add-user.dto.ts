import { IsNumber } from 'class-validator';

export class AddUserToBusiness {
  @IsNumber()
  userId: number;

  @IsNumber()
  businessId: number;
}
