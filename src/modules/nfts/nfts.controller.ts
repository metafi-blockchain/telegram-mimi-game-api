import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NFT_STATUS } from './nft.entity';
import { Web3 } from 'web3'

@Controller('nfts')
export class NftsController {
    constructor(
        private readonly nftService: NftsService,
    ) {}

    @Get('/in-market')
    async getNftListMarket() {
        return this.nftService.aggregate([
            {
                $match: {
                    nft_status: NFT_STATUS.LISTING_MARKET
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }

    @Get('/detail/:collectionAddress/:nftId')
    async getDetailNft( @Param('collectionAddress') collectionAddress: string, @Param('nftId') nftId: string,) {

        if (!Web3.utils.isAddress(collectionAddress)) 
            throw new BadRequestException('Invalid address');
        
        return this.nftService.finOneWithCondition({ tokenId: Number(nftId), collection_address: collectionAddress });
    }


    @Get('/owner/:account')
    async getByOwner( @Param('account') account: string, ) {


        if (!Web3.utils.isAddress(account)) {
            throw new BadRequestException('Invalid address');
        }

        return this.nftService.aggregate([
            {
                $match: {
                    owner: account
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }

    @Get('/collection/:collectionAddress')
    async getByCollection( @Param('collectionAddress') collectionAddress: string) {

        if (!Web3.utils.isAddress(collectionAddress))   throw new BadRequestException('Invalid address');
        
        return this.nftService.aggregate([
            {
                $match: {
                    collection_address: collectionAddress,
                    nft_status: NFT_STATUS.LISTING_MARKET
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }
  




}
