import { Injectable } from '@nestjs/common';
import { BaseService } from '../commons/base.service';
import { NftType } from './nft-types.entity';
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

        //validate data
        const response = await this.nftModel.findOne({name: nftType.name}).exec()
        if(response) throw new Error('NFT Type already exists')
            
        const privateKey = await this.oracleConfigsService.getOperatorKeyHash()
        console.log("privateKey:", privateKey);
        if(!privateKey) throw new Error('Invalid Operator Private Key')

                        //create on database
        const nft  = await this.nftModel.create(nftType)
        console.log(nft);
        
        const request = await this.nftFactoryService.deployNft({
            owner: nftType.owner,
            salt: nftType.salt,
            name: nftType.name,
            symbol: nftType.symbol,
        }, privateKey)
        console.log(request);
        
   



    }
    

}
