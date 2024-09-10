import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { CreateNftDto, MintNftDto } from './dtos/nft.dto';
import { NftsService } from './nfts.service';
import { MINT_STATUS } from './nft.entity';

@Controller('nfts')
export class NftsController {
    constructor(
        private readonly nftService: NftsService,
    ) {}

    @Post('/create')
    async createNft(@Body() nftType: CreateNftDto) {
        return this.nftService.createNft(nftType);
    }




}
