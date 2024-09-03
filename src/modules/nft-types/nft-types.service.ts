import { Injectable } from '@nestjs/common';
import { BaseService } from '../commons/base.service';
import { NftType, TRANSACTION } from './nft-types.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {NFTFactoryService} from '../../blockchains/services/index'
import { CreateNftTypeDto } from './dtos/nft-types.dto';
import { ConfigService } from '@nestjs/config';
import { OracleConfigsService } from '../configs/oracle-configs.service';

@Injectable()
export class NftTypesService extends BaseService<NftType> {

    // private readonly nftFactoryService: NFTFactoryService;
    constructor(@InjectModel(NftType.name) private nftModel: Model<NftType>,  
     private readonly nftFactoryService: NFTFactoryService, 
     private readonly oracleConfigsService: OracleConfigsService,
    ){
        super(nftModel)
    };

    async deployNftType(nftType: CreateNftTypeDto){

        try {
     
                
            const privateKey = await this.oracleConfigsService.getOperatorKeyHash()
            if(!privateKey) throw new Error('Invalid Operator Private Key')
    
            //create on database

            const contractAdd =  await this.nftFactoryService.getContractDeployAddress({
                owner: nftType.owner,
                salt: nftType.salt,
                name: nftType.name,
                symbol: nftType.symbol,
            })
            const response = await this.nftModel.findOne({nft_address: contractAdd}).exec()
            if(response) throw new Error('contract nft already exists')

            //create on database    
            const nft  = await this.nftModel.create({
                nft_address: contractAdd,
                name: nftType.name,
                symbol: nftType.symbol,
                salt: nftType.salt,
                owner: nftType.owner,
                status: TRANSACTION.SENDING,
                is_active: false
            });

            //send request to blockchain
            this.nftFactoryService.deployNft({
                owner: nftType.owner,
                salt: nftType.salt,
                name: nftType.name,
                symbol: nftType.symbol,
            }, privateKey).then(async (tx) => {
                console.log('tx:', tx);
                nft.status = TRANSACTION.DONE;
                nft.is_active = true;
                await nft.save();
            }).catch(async (err) => {
                console.log('err:', err);
                nft.status = TRANSACTION.ERROR;
                await nft.save();
            })   
            
            
            return nft; 
        } catch (error) {
            console.log(error);
        }

    }

    async findAllWithCondition(cond: {}){
        return this.nftModel.find(cond).exec()
    }
    

}
