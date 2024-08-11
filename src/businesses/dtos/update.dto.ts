import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  plan?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
