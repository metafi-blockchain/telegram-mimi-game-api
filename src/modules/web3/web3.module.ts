// src/web3/web3.module.ts
import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import the ConfigModule to access environment variables
  providers: [Web3Service],
  exports: [Web3Service], // Export the service so it can be injected elsewhere
})
export class Web3Module {}