import { Injectable } from '@nestjs/common';
import { BaseService } from '../commons/base.service';
import { MintRequest } from './request.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketService } from 'src/blockchains/services/market-place.service';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { ListNftsByIdsDto } from './dtos';
import { ListingByAdminParam } from 'src/blockchains/libs/interface';

@Injectable()
export class MintRequestService extends BaseService<MintRequest> {

    constructor(@InjectModel(MintRequest.name) private mintRequestModel: Model<MintRequest>,  
    private readonly marketPlaceService: MarketService,
    private readonly oracleConfigsService: OracleConfigsService,


   ){
       super(mintRequestModel)
   };

    async listingNftByTokenIds(params : ListNftsByIdsDto){
        const privateKey = await this._getPrivateKeyMint();
        let data = {
            nftsAddress: params.nftAddress,
            nftIds: params.tokenIds,
            prices: params.prices,
            currencies: params.currencies,
            durations: params.durations,

        } as ListingByAdminParam
        return this.marketPlaceService.listingByAdmin(data, privateKey)
    }

    async listingNftByGen(params : ListNftsByIdsDto){
        const privateKey = await this._getPrivateKeyMint();
        let data = {
            nftsAddress: params.nftAddress,
            nftIds: params.tokenIds,
            prices: params.prices,
            currencies: params.currencies,
            durations: params.durations,

        } as ListingByAdminParam
        return this.marketPlaceService.listingByAdmin(data, privateKey)
    }



    async setNftSupportMarket(nftAddress: string [], active: boolean[]){
        const privateKey = await this._getPrivateKeyMint();
        return this.marketPlaceService.setNFTSupport(nftAddress, active, privateKey)
    }

    async createMintRequest(gen: string){
        return this.mintRequestModel.create({gen: gen})
    }
    //create many mint request
    async createManyMintNftRequest(reception: string, gens: string[]){
        return this.mintRequestModel.insertMany(gens.map(gen => ({gen, reception})))
    }

    async findWithCondition(condition ={}){
        return this.mintRequestModel.find(condition).exec();
    }

    




    async checkGenExits(gen: string): Promise<boolean>{
        const nft = await this.mintRequestModel.findOne({gen}).exec();
        return !!nft;
    }




    private async _getPrivateKeyMint(): Promise<string>{
        const privateKey = await this.oracleConfigsService.getOperatorKeyHash()
        if(!privateKey) throw new Error('Invalid Operator Private Key')
        return privateKey;
    }

}
