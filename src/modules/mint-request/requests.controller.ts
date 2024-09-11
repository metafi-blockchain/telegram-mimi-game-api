import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Next, NotFoundException, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { MintRequestService } from './requests.service';
import { STATUS } from './request.entity';
import { CreateNftTypeDto, ListNftsDto, MintNftsDo, MintNftDto, SetNftSupport, ListNftsByGensDto } from './dtos';
import { NftTypesService } from '../nft-types/nft-types.service';
import { NftsService } from '../nfts/nfts.service';
import { MINT_STATUS, NFT, NFT_STATUS } from '../nfts/nft.entity';

@Controller('requests')
export class MintRequestController {
    constructor(
        private readonly requestService: MintRequestService,
        private readonly nftTypesService: NftTypesService,
        private readonly nftService: NftsService

    ) {

    }


    @Post('/deploy-nft-contract')
    async createNftType(@Body() nftType: CreateNftTypeDto) {

        return this.nftTypesService.deployNftType(nftType);
    }

    //create many mint request
    @Post('/create-request-mint-nfts')
    async createManyMintRequest(@Body() parma: MintNftsDo) {

        const { gens, reception } = parma;

        if (gens.length === 0) throw new BadRequestException('gens is required')
        // if(!reception) throw new BadRequestException('reception is required')

        console.log('gens:', gens);
        const response = await this.requestService.findWithCondition({ gen: { $in: gens } })

        if (response.length > 0) {
            let genExits = await this.checkGensExits(gens);
            throw new ConflictException(`${genExits.join(";")} gen already exists`)
        }
        return this.requestService.createManyMintNftRequest(reception, gens);
    }

    @Post('/set-nfts-support')
    async addNftSupport(@Body() param: SetNftSupport) {
        const { nftAddress, active } = param;

        if (nftAddress.length !== active.length) throw new BadRequestException('nftAddress and active must be the same length')
        if (nftAddress.length === 0) throw new BadRequestException('nftAddress is required');
        return this.requestService.setNftSupportMarket(nftAddress, active)
        // this.nftService.
    }

    @Post('/list-nfts-by-gens')
    async listNftsByGen(@Body() param: ListNftsByGensDto) {
        const { gens, nftAddress } = param;
        console.log('gens:', gens);
        console.log('nftAddress:', nftAddress);
    

        if (!gens.length) throw new BadRequestException('gens is required');
        if (gens.length !== param.currencies.length || gens.length !== param.prices.length || gens.length !== param.durations.length) {
            throw new BadRequestException('All arrays must have the same length');
        }

        const nftType = await this.nftTypesService.finOneWithCondition({ nft_address: param.nftAddress });

        if (!nftType) throw new NotFoundException('collection not found');

        if (nftType.is_market_support === false) throw new BadRequestException('collection is not support in market')

        const nfts = await this.nftService.aggregate([
            {
                $match: {
                    collection_address: nftAddress,
                    gen: { $in: gens },
                    nft_status: NFT_STATUS.AVAILABLE
                }, // Match NFTs with the desired status and generation
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    owner: 1, // Include the owner field
                    name: 1, // Include the name field
                    collection_address: 1, // Include the collection_address field
                    tokenId: 1, // Include the uri field
                    gen: 1, // Include the gen field
                    // Add other fields as needed
                },
            },
            {
                $limit: 100, // Limit the results to 100 NFTs
            }
        ]);

        console.log('nfts:', nfts);

        if (nfts.length !== gens.length) {
            //get tokenIds not exits
            const genExits = nfts.map(e => e.gen);
            const genNotExits = gens.filter(e => !genExits.includes(e))
            throw new NotFoundException(`gens ${genNotExits.join(',')} not exits`)
        }
        return this.requestService.listingNftByAdmin({
            nftAddress: nftAddress,
            tokenIds: nfts.map((e: NFT) => e.tokenId),
            currencies: param.currencies,
            prices: param.prices,
            durations: param.durations
        })


    }


    @Post('/list-nfts-Ids')
    async listNftsByIds(@Body() param: ListNftsDto) {
        const { nftAddress, tokenIds, currencies, prices, durations } = param;

        if (!tokenIds.length) throw new BadRequestException('tokenIds is required');
        if (tokenIds.length !== param.currencies.length || tokenIds.length !== param.prices.length || tokenIds.length !== param.durations.length) {
            throw new BadRequestException('All arrays must have the same length');
        }

        const nftType = await this.nftTypesService.finOneWithCondition({ nft_address: nftAddress });

        if (!nftType) throw new NotFoundException('collection not found');

        if (nftType.is_market_support === false) throw new BadRequestException('collection is not support in market')

        //check tokenIds exits and listed on market
       const nfts = await this.nftService.aggregate([
            {
                $match: {
                    collection_address: nftAddress,
                    tokenId: { $in: tokenIds },
                    nft_status: NFT_STATUS.AVAILABLE
                }, // Match NFTs with the desired status and generation
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    owner: 1, // Include the owner field
                    name: 1, // Include the name field
                    collection_address: 1, // Include the collection_address field
                    tokenId: 1, // Include the uri field
                    gen: 1, // Include the gen field
                },
            },
            {
                $limit: 100, // Limit the results to 100 NFTs
            }
        ]);

        if (nfts.length !== tokenIds.length) {
            //get tokenIds not exits
            const tokenIdsExits = nfts.map((e: NFT) => e.tokenId);
            const tokenIdsNotExits = tokenIds.filter(e => !tokenIdsExits.includes(e))
            throw new NotFoundException(`tokenIds ${tokenIdsNotExits.join(',')} not exits`)
        }

        return this.requestService.listingNftByAdmin(param)

    }


    @Post('/mint-nft-by-gen')
    async mintNft(@Body() nftDto: MintNftDto) {
        const nft = await this.nftService.finOneWithCondition({ gen: nftDto.gen, minting_status: MINT_STATUS.INITIALIZE });
        if (!nft) throw new NotFoundException('NFT not found or NFT already minted');
        return this.nftService.mintNft(nft);
    }

    //get all mint request 
    @Get('get-mint-submitting')
    async getAllMintRequest() {
        return this.requestService.findWithCondition({ status: STATUS.SUBMIT })
    }


    private async checkGensExits(gens: string[]) {
        let genExits = []

        for (let gen of gens) {
            const response = await this.requestService.checkGenExits(gen)
            if (response) genExits.push(gen)
        }
        return genExits;
    }

}
