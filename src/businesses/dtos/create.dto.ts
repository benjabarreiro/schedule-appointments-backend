import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsNumber()
  plan: number;

  @IsBoolean()
  isActive: boolean;
}
