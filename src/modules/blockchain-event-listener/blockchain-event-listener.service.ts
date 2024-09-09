import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import factoryAbi from '../../blockchains/abis/EnteralKingdomNFTFactory2.json';
import depositAbi from '../../blockchains/abis/EnterKingDomDeposit.json';
import { encryptPrivateKeyWithARES } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { NftTypesService } from '../nft-types/nft-types.service';
import erc721Abi from '../../blockchains/abis/EnteralKingDomERC721.json';
import { MintNftEvent } from 'src/blockchains/libs/interface';
import { NftsService } from '../nfts/nfts.service';
import { MINT_STATUS } from '../nfts/nft.entity';



@Injectable()
export class BlockchainEventListenerService implements OnModuleInit{

    private provider: ethers.JsonRpcProvider;
    private factoryContract: ethers.Contract;
    private depositContract: ethers.Contract;


    constructor(private readonly configService: ConfigService, 
      private nftTypService: NftTypesService,
      private nftService: NftsService
    ) {     
    }



    async onModuleInit() {
        const rpcUrl = this.configService.get<string>('RPC_URL'); // Địa chỉ RPC của blockchain
        const factoryContractAddress = this.configService.get<string>('NFT_FACTORY_ADDRESS') ; // Địa chỉ hợp đồng thông minh
        const depositContractAddress = this.configService.get<string>('DEPOSIT_CONTRACT_ADDRESS') ; // Địa chỉ hợp đồng thông minh

        console.log('rpcUrl:', rpcUrl);
    
        
        // Kết nối đến provider
        this.provider = new ethers.JsonRpcProvider(rpcUrl);


      

        //get all contract nft type
        const nftTypes = await this.nftTypService.findAllWithCondition({
          is_active: true,
          status: 'DONE'
        });
       
        if(nftTypes.length === 0) return; 
        
       
        // listen event from nft contract
          nftTypes.forEach(async (nftType) => {
            console.log("listening event for nft: ", nftType.nft_address);
            
            const contractAddress = nftType.nft_address;
              const erc721Contract = new ethers.Contract(contractAddress, erc721Abi.abi, this.provider);
              erc721Contract.on('NFTMinted', (recipient, tokenId, uri, event) => {
              console.log('Full event data:', event.log);
              console.log('tokenId', tokenId);
               this.handleMintNftEvent({
                recipient,
                tokenId,
                uri
              }, event);
            });

          });

          //listen event from deposit contract    from: string,
        // listen event from factory contract
        this.depositContract = new ethers.Contract(depositContractAddress, depositAbi, this.provider);
         console.log("listening event for Deposit: ", depositContractAddress);
          this.depositContract.on('Desposit', (from, tokenAddress, amount, time,  event) => {
            //handle deposit event
            console.log('Full event data:', event.log);
            
          });
      
        

    
        
        // Kết nối đến hợp đồng
        this.factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi.abi, this.provider);
        this.factoryContract.on('Deployed', (arg1, arg2, event) => {
          console.log('listening event for factory:', factoryContractAddress);    
          // Xử lý logic khi nhận được sự kiện
          this.handleDeployNftEvent(arg1, arg2, event);
        });
      }
    
      
      private handleDeployNftEvent(arg1: any, arg2: any, event: Event) {
        // Xử lý logic khi nhận được sự kiện từ hợp đồng
        console.log('Handling event:', arg1, arg2);
      }

      private async handleMintNftEvent( data: MintNftEvent, event: Event){
        console.log('Full data:', data);
        await this.nftService.update({ uri: data.uri}, {
          minting_status: MINT_STATUS.MINTED,
          tokenId: Number(data.tokenId),
          owner: data.recipient
        });

        console.log('Full event data:', event['log']);
        
        // console.log('Handling mint:', recipient, tokenId);
      }
}
