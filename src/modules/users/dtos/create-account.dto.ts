
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  referId: string;

  @IsOptional()
  @IsBoolean()
  isPremium: boolean;
}