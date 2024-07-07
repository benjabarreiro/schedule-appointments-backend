import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsNumber()
  adminId: number;

  @IsNumber()
  planId: number;

  @IsBoolean()
  isActive: boolean;
}
