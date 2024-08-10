import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsNumber()
  adminId: number;

  @IsNumber()
  plan: number;

  @IsBoolean()
  isActive: boolean;
}
