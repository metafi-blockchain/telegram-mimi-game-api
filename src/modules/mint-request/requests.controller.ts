import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Next, NotFoundException, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { MintRequestService } from './requests.service';
import { STATUS } from './request.entity';
import { CreateNftTypeDto, ListNftsByIdsDto, MintNftsDo, MintNftDto, SetNftSupport } from './dtos';
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

    @Post('/list-nfts-by-gen')
    async listNftsByGen(@Body() param: SetNftSupport) {

    }


    @Post('/list-nfts-Ids')
    async listNftsByIds(@Body() param: ListNftsByIdsDto) {
        // const {nftAddress, tokenIds, currencies, prices, durations} = param;

        if (!param.tokenIds.length) throw new BadRequestException('tokenIds is required');
        if (param.tokenIds.length !== param.currencies.length || param.tokenIds.length !== param.prices.length || param.tokenIds.length !== param.durations.length) {
            throw new BadRequestException('All arrays must have the same length');
        }

        const nftType = await this.nftTypesService.finOneWithCondition({ nft_address: param.nftAddress });

        if (!nftType) throw new NotFoundException('nft not found');

        if (nftType.is_active === false) throw new BadRequestException('nft is not active')

        //check tokenIds exits and listed on market
        const nfts = await this.nftService.aggregate({ nft_address: param.nftAddress, token_id: { $in: param.tokenIds }, nft_status: NFT_STATUS.AVAILABLE })

        if (nfts.length !== param.tokenIds.length) {
            //get tokenIds not exits
            const tokenIdsExits = nfts.map(e => e.token_id);
            const tokenIdsNotExits = param.tokenIds.filter(e => !tokenIdsExits.includes(e))
            throw new NotFoundException(`tokenIds ${tokenIdsNotExits.join(',')} not exits`)
        }

        return this.requestService.listingNftByTokenIds(param)

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
        return this.requestService.findWithCondition({ status: STATUS.SUBMITTING })
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
