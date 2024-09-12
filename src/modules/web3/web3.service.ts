// src/web3/web3.service.ts
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Service implements OnModuleInit {
  private web3: Web3;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    this.web3 = new Web3(rpcUrl);
  }

  getWeb3(): Web3 {
    return this.web3;
  }

  async getBlockNumber(): Promise<number> {
    return Number(await this.web3.eth.getBlockNumber());
  }

  async getTransaction(transactionHash: string) {
    return await this.web3.eth.getTransaction(transactionHash);
  }

  // Add more Web3-related methods here as needed
}