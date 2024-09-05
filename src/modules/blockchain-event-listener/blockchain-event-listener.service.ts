import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import factoryAbi from '../../blockchains/abis/EnteralKingdomNFTFactory2.json';
import { encryptPrivateKeyWithARES } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { NftTypesService } from '../nft-types/nft-types.service';
import erc721Abi from '../../blockchains/abis/EnteralKingDomERC21.json';
import { MintNftEvent } from 'src/blockchains/libs/interface';



@Injectable()
export class BlockchainEventListenerService implements OnModuleInit{

    private provider: ethers.JsonRpcProvider;
    private factoryContract: ethers.Contract;
    private depositContract: ethers.Contract;

    constructor(private readonly configService: ConfigService, private nftTypService: NftTypesService  ) {     
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

        //get all contract nft type
        const nftTypes = await this.nftTypService.findAllWithCondition({
          is_active: true,
          status: 'DONE'
        });
       
        
       
          nftTypes.forEach(async (nftType) => {

            const contractAddress = nftType.nft_address;
              const erc721Contract = new ethers.Contract(contractAddress, erc721Abi.abi, this.provider);
              erc721Contract.on('NFTMinted', (recipient, tokenId, uri, event) => {
              console.log('Full event data:', event.log);
              this.handleMintNftEvent({
                recipient,
                tokenId,
                uri
              }, event);
            });

          });
      
        

    
        // Đăng ký sự kiện từ hợp đồng
        this.factoryContract.on('Deployed', (arg1, arg2, event) => {
  
          // console.log('Full event data:', event);
    
          // Xử lý logic khi nhận được sự kiện
          this.handleDeployNftEvent(arg1, arg2, event);
        });
      }
    
      private handleDeployNftEvent(arg1: any, arg2: any, event: Event) {
        // Xử lý logic khi nhận được sự kiện từ hợp đồng
        console.log('Handling event:', arg1, arg2);
      }

      private handleMintNftEvent( data: MintNftEvent,event: Event){
        console.log('Full event data:', event);
        
        // console.log('Handling mint:', recipient, tokenId);
      }
}
