
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class CreateAccountDto {

  @ApiProperty({ description: 'The name' })
  @IsString()
  name: string;


  @ApiProperty({ description: 'The username' })
  @IsString()
  username: string;


  @ApiProperty({ description: 'The referId' })
  @IsOptional()
  @IsString()
  referId: string;

  @ApiProperty({ description: 'isPremium' })
  @IsOptional()
  @IsBoolean()
  isPremium: boolean;
}