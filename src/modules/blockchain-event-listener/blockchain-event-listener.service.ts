import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import factoryAbi from '../../blockchains/abis/EnteralKingdomNFTFactory2.json';
import { encryptPrivateKeyWithARES } from 'src/utils';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class BlockchainEventListenerService implements OnModuleInit{

    private provider: ethers.JsonRpcProvider;
    private factoryContract: ethers.Contract;
    private depositContract: ethers.Contract;

    constructor(private readonly configService: ConfigService) {     
    }



    async onModuleInit() {
        const rpcUrl = this.configService.get<string>('RPC_URL'); // Địa chỉ RPC của blockchain
        const contractAddress = this.configService.get<string>('NFT_FACTORY_ADDRESS') ; // Địa chỉ hợp đồng thông minh
        
        console.log('rpcUrl:', rpcUrl);
        console.log('contractAddress:', contractAddress);
        
        // Kết nối đến provider
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Kết nối đến hợp đồng
        this.factoryContract = new ethers.Contract(contractAddress, factoryAbi.abi, this.provider);
    
        // Đăng ký sự kiện từ hợp đồng
        this.factoryContract.on('Deployed', (arg1, arg2, event) => {
          console.log(`Event detected: ${arg1}, ${arg2}`);
          console.log('Full event data:', event);
    
          // Xử lý logic khi nhận được sự kiện
          this.handleEvent(arg1, arg2, event);
        });
      }
    
      private handleEvent(arg1: any, arg2: any, event: Event) {
        // Xử lý logic khi nhận được sự kiện từ hợp đồng
        console.log('Handling event:', arg1, arg2);
        
      }
}
