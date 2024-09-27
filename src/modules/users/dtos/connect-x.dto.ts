// src/user/dto/connect-x.dto.ts

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ConnectXDto {
  @IsString()
  xId: string;

  @IsString()
  xName: string;

  @IsString()
  xAccount: string;

  @IsString()
  xAvatar: string;

  @IsNumber()
  xFollowers: number;

  @IsNumber()
  xCreatedAt: number;

  @IsString()
  xVerified: string;
}