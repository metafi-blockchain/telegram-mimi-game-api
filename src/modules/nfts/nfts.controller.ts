import { Body, Controller, Post } from '@nestjs/common';
import { CreateNftDto, MintNftDto } from './dtos/nft.dto';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
    constructor(
        private readonly nftService: NftsService,
    ) {}

    @Post('/create')
    async createNft(@Body() nftType: CreateNftDto) {
        return this.nftService.createNft(nftType);
    }

    @Post('/mint')
    async mintNft(@Body() nft: MintNftDto) {
        console.log('gen:', nft);
        
        return this.nftService.mintNft(nft.gen);
    }


}
