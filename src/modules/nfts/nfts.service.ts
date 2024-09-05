import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { MultiDelegateCallService } from 'src/blockchains/services/multicall.service';
import { MINT_STATUS, NFT } from './nft.entity';
import { Model } from 'mongoose';
import { MintRequestService } from '../mint-request/mint-request.service';
import { CreateNftDto } from './dtos/nft.dto';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { ERC721Service } from 'src/blockchains/services';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class NftsService {


    constructor(
        @InjectModel(NFT.name) private nftModel: Model<NFT>, 
        // private readonly mintRequest: MintRequestService, 
        private readonly configService: ConfigService, 
        private readonly oracleConfigsService: OracleConfigsService,
        private readonly multiDelegateCallService: MultiDelegateCallService,
        private readonly telegramService: TelegramService

    ) {        
    }

    async getNFTs() {
        // const rpcUrl = this.configService.get<string>('RPC_URL');
        // const multiCallAddress = this.configService.get<string>('MULTI_DELEGATE_CALL_ADDRESS');
        // console.log('rpcUrl:', rpcUrl);
        // console.log('multiCallAddress:', multiCallAddress);
        // Call the multiDelegateCallService
    }

    async createNft(nft: CreateNftDto) {
       return this.nftModel.create(nft);
    }

    async mintNft(gen: string){
        const nft = await this.nftModel.findOne({gen}).exec();
        if (!nft) throw new Error('NFT not found or NFT already minted');

        const privateKey = await this.getPrivateKeyMint();

        const nftMint =  {
            recipient: nft.owner,
            uri: nft.uri,
            collection_address: nft.collection_address,
        }  
        const rpcUrl = this.configService.get<string>('RPC_URL')
        const erc721Service =   new ERC721Service(nft.collection_address, rpcUrl)
        const result = await erc721Service.mintNFT(nftMint, privateKey)
        if(result.status){
            nft.minting_status = MINT_STATUS.MINTED;
            await nft.save();
            this.telegramService.sendMessage(`mint nft with gen: ${gen} success`)
        }else{
            this.telegramService.sendMessage(`mint nft with gen: ${gen} failed`)    
        }
        return result;
        // return await this.multiDelegateCallService.mintBatchNFT([nftMint], privateKey);

    }

    async mintNftBatch(gens: string[]){
        //get nft
        const nfts = await this.nftModel.find({gen: {$in: gens}, minting_status: MINT_STATUS.INITIALIZE}).exec();
        if (!nfts) throw new Error('NFT not found');

        const listNfts = nfts.map(nft => ({recipient: nft.owner, uri: nft.uri, collection_address: nft.collection_address}));

        const privateKey = await this.getPrivateKeyMint();
        const result = await this.multiDelegateCallService.mintBatchNFT(listNfts, privateKey);
        return result;
        
    }

    private async getPrivateKeyMint(): Promise<string>{
        const privateKey = await this.oracleConfigsService.getOperatorKeyHash()
        if(!privateKey) throw new Error('Invalid Operator Private Key')
        return privateKey;
    }


}
