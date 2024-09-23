import { ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BaseService } from '../commons/base.service';
import { NftType, TRANSACTION } from './nft-types.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {NFTFactoryService} from '../../blockchains/services/index'
import { CreateNftTypeDto } from './dtos/nft-types.dto';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { ResponseSendTransaction } from 'src/blockchains/libs/interface';

@Injectable()
export class NftTypesService extends BaseService<NftType> {

    // private readonly nftFactoryService: NFTFactoryService;
    constructor(@InjectModel(NftType.name) private nftModel: Model<NftType>,  
     private readonly nftFactoryService: NFTFactoryService, 
     private readonly oracleConfigsService: OracleConfigsService,
    ){
        super(nftModel)
    };

    async deployNftType(nftType: CreateNftTypeDto) {

     
            const privateKey = await this.oracleConfigsService.getOperatorKeyHash();
            if (!privateKey) throw new ServiceUnavailableException('Invalid Operator Private Key');
    
            const { owner, salt, name, symbol, type: collectionType, chainId } = nftType;
    
            // Check if contract already exists
            const contractAdd = await this.nftFactoryService.getContractDeployAddress({ owner, salt, name, symbol });
            const existingNft = await this.nftModel.findOne({ nft_address: contractAdd }).exec();
            console.log('existingNft', existingNft);
            
            
            if (existingNft) throw new ConflictException('NFT contract already exists');
    
            // Create NFT entry in the database with "SENDING" status
            const nft = await this.nftModel.create({
                nft_address: contractAdd,
                name,
                symbol,
                salt,
                owner,
                chain_id: chainId,
                status: TRANSACTION.SUBMITTING,
                collection_type: collectionType,

            });
    
            // Deploy NFT on blockchain and update the database accordingly
      
               this.nftFactoryService.deployNft({ owner, salt, name, symbol }, privateKey).
               then(async (response: ResponseSendTransaction) => {
                console.log('Blockchain transaction response:', response);
        
               }).catch((error) => {
                console.error('Blockchain transaction error:', error);
                nft.status = TRANSACTION.ERROR;
               });
               return nft;
    
       
    }



    async findAllWithCondition(cond: {}){
        return this.nftModel.find(cond).exec()
    }



     async checkCanUpdateByBlockNumber(nft_address: string , blockNumber: number){
        const nftTypes = await this.nftModel.findOne({nft_address}).exec()
        return Number(blockNumber) > Number(nftTypes.block_number)
    }
    

}
