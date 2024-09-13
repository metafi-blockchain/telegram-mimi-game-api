// src/web3/web3.service.ts
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service implements OnModuleInit {
    private web3: Web3;
    private provider: ethers.JsonRpcProvider;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const rpcUrl = this.configService.get<string>('RPC_URL');
        this.web3 = new Web3(rpcUrl);
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

    }

    getContract(abi: any, address: string) {

        return new this.web3.eth.Contract(abi, address);
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

   async listenToContractEvents(abi: any, contractAddress: string, handler: (event: any) => void) {

        const erc721Contract = new ethers.Contract(contractAddress, abi, this.provider);


        const contract = this.getContract(abi, contractAddress);

     const blocks = [35836854,35838209]; // Define the range of blocks to listen to
    
     const pastEvents = await contract.getPastEvents('allEvents', 
        {
            fromBlock: blocks[0],         // Starting block number
            toBlock: blocks[blocks.length - 1] 
        })
       console.log('pastEvents:', pastEvents);
       handler(pastEvents) 
    }

   
}