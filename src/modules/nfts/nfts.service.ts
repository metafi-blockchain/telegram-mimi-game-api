import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { MultiDelegateCallService } from 'src/blockchains/services/multicall.service';
import { MINT_STATUS, NFT } from './nft.entity';
import { Model } from 'mongoose';
import { CreateNftDto } from './dtos/nft.dto';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { ERC721Service } from 'src/blockchains/services';
import { TelegramService } from '../telegram/telegram.service';
import { BaseService } from '../commons/base.service';
import { ResponseSendTransaction } from 'src/blockchains/libs/interface';
import { CryptoUtils } from 'src/blockchains/utils';

@Injectable()
export class NftsService extends BaseService<NFT> {


    constructor(
        @InjectModel(NFT.name) private nftModel: Model<NFT>,
        // private readonly mintRequest: MintRequestService, 
        private readonly configService: ConfigService,
        private readonly oracleConfigsService: OracleConfigsService,
        private readonly multiDelegateCallService: MultiDelegateCallService,
        private readonly telegramService: TelegramService

    ) {
        super(nftModel)
    }

    async createNft(nft: CreateNftDto) {
        return this.nftModel.create(nft);
    }

    async mintNft(nft: NFT) {


        const privateKey = await this._getPrivateKeyMint();
        const defaultOwner = CryptoUtils.getWalletFromPrivateKey(privateKey);

        const nftMint = {
            recipient: nft.owner || defaultOwner,
            uri: nft.uri,
            collection_address: nft.collection_address,
        }
        const rpcUrl = this.configService.get<string>('WEB3_RPC_URL')
        const erc721Service = new ERC721Service(nft.collection_address, rpcUrl)
        const result = await erc721Service.mintNFT(nftMint, privateKey)
        if (result.status) {
            // nft.minting_status = MINT_STATUS.MINTED;
            // await nft.save();
            this.telegramService.sendMessage(`mint nft with gen: ${nft.gen} success`)
        } else {
            this.telegramService.sendMessage(`mint nft with gen: ${nft.gen} failed`)
        }
        return result;
        // return await this.multiDelegateCallService.mintBatchNFT([nftMint], privateKey);

    }


    async mintBatchNFT(collection_address: string, nftMints: NFT[]): Promise<ResponseSendTransaction> {
        if (!nftMints.length) {
            console.log('No NFT to mint');
            return { status: false };
        }
        const privateKey = await this._getPrivateKeyMint();
        const rpcUrl = this.configService.get<string>('WEB3_RPC_URL')
        const erc721Service = new ERC721Service(collection_address, rpcUrl);
        const defaultOwner = CryptoUtils.getWalletFromPrivateKey(privateKey);
        const data = nftMints.map(nft => ({ recipient: nft.owner || defaultOwner, uri: nft.uri, collection_address: nft.collection_address }));
        const result = await erc721Service.mintBatchNFT(data, privateKey);
        let gen = nftMints.map(e => e.gen).join(",");
        if (result.status) {
            this.telegramService.sendMessage(`mint nft with gen: ${gen} success`)
        } else {
            this.telegramService.sendMessage(`mint nft with gen: ${gen} failed`)
        }
        return result;
    }




    async getNftsByMintStatus(minting_status: MINT_STATUS, collection_address: string): Promise<NFT[]> {
        const nftRequest = await this.nftModel.aggregate([
            {
                $match: { minting_status, collection_address }, // Match NFTs with the desired minting status
            },
            {
                $project: {
                    owner: 1, // Exclude _id from the result (optional)
                    name: 1, // Include the name field
                    collection_address: 1, // Include the minting_status field
                    uri: 1, // Include the uri field
                    gen: 1, // Include the gen field
                    // Add other fields to project or include
                },
            },
            {
                $limit: 100, // Limit the results to the top 100 NFTs
            },
            // Other stages like $group, $sort, etc. can be added if needed
        ]);

        return nftRequest; // This returns the aggregated NFT data
    }


    async updateStateNFT( nftAddress: string, nftId: number, block_number: number, updateFields: Partial<any>) {
        try {
            const tokenId = Number(nftId);

            const canUpdate = await this._checkCanUpdateByBlockNumber(nftAddress, tokenId, block_number);
    
            if (!canUpdate) {
                console.log(`TokenId ${tokenId} already updated at block: ${block_number}`);
                return false;
            }
    
            await this.nftModel.findOneAndUpdate({ tokenId: tokenId, collection_address: nftAddress }, { ...updateFields, block_number }).exec();
            return true;  
        } catch (error) {
            console.log(`Error updating NFT: ${error}`);
            return false;
        }

    }


    private async _getPrivateKeyMint(): Promise<string> {
        const privateKey = await this.oracleConfigsService.getOperatorKeyHash()
        if (!privateKey) throw new Error('Invalid Operator Private Key')
        return privateKey;
    }

    private async _checkCanUpdateByBlockNumber(nftContractAddress: string, nftId: number, block_number: number) {
        const nft = await this.nftModel.findOne({ tokenId: Number(nftId), collection_address: nftContractAddress }).exec();
        return nft.block_number < block_number;
    }



}
