import { Injectable } from '@nestjs/common';
import { BaseService } from '../commons/base.service';
import { MintRequest } from './mint-request.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MintRequestService extends BaseService<MintRequest> {

    constructor(@InjectModel(MintRequest.name) private mintRequestModel: Model<MintRequest>,  

   ){
       super(mintRequestModel)
   };

    async createMintRequest(gen: string){
        return this.mintRequestModel.create({gen: gen})
    }
    //create many mint request
    async createManyMintRequest(gens: string[]){
    
            //check gen is unique
      

            return this.mintRequestModel.insertMany(gens.map(gen => ({gen})))
      
        
    }
    async findWithCondition(condition ={}){
        return this.mintRequestModel.find(condition).exec();
    }

}
