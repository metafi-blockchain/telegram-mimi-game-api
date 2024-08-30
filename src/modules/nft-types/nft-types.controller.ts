import { Body, Controller, Post } from '@nestjs/common';
import { NFTFactoryService } from 'src/blockchains/services';
import { NftTypesService } from './nft-types.service';
import { CreateNftTypeDto } from './dtos/nft-types.dto';

@Controller('nft-types')
export class NftTypesController {
    
    constructor(
        private readonly nftTypesService: NftTypesService,
        private readonly nftFactoryService: NFTFactoryService,
    ) {}

    @Post('/deploy')
    async createNftType(@Body() nftType: CreateNftTypeDto) {
        return this.nftTypesService.deployNftType(nftType);
    }

}

