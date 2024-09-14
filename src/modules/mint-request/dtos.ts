

import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsBoolean, IsNumber, IsString} from 'class-validator'


export class MintNftsDo {
    @IsArray()
    gens: string[];
    @IsString()
    reception: string;
}


export class CreateNftTypeDto {
    @IsString()
    name: string;
    @IsString()
    symbol: string;
    @IsString()
    owner: string;
    @IsNumber()
    salt: number;
    @IsString()
    type: string;
}

export class SetNftSupport {
    @IsArray()
    nftAddress: string [];
    @IsArray()
    active: boolean [];
}


export class ListNftsDto {
    @ApiProperty({ description: 'The nft contract address', example: '0x6F7a1FF0711269bd20964168247dB76e5fda9f1f' })
    @IsString()
    nftAddress: string;

    @ApiProperty({ description: 'The token Id of nfts', example: [1,2,3] })
    @IsArray()
    tokenIds: number[];
    @ApiProperty({ description: 'price token Id of nfts', example: [11000,20000,30000] })
    @IsArray()
    prices: number[];

    @ApiProperty({ description: 'The currency address of nft', example: ["0xcC83B44ea968DaE4EC562F0E94fB37937b88db41","0xcC83B44ea968DaE4EC562F0E94fB37937b88db42","0xcC83B44ea968DaE4EC562F0E94fB37937b88db43"] })
    @IsArray()
    currencies: string[];
    @ApiProperty({ description: 'The durations listing in seconds', example: [300, 3001, 3002] })
    @IsArray()
    durations: number[];

}

export class ListNftsByGensDto {
    @ApiProperty({ description: 'The nft contract address', example: '0x6F7a1FF0711269bd20964168247dB76e5fda9f1f' })
    @IsString()
    nftAddress: string;

    @ApiProperty({ description: 'The gen of nft', example: ['100000000100001009000001700450000120000010000320001550001700011'] })
    @IsArray()
    gens: string[];

    @ApiProperty({ description: 'The price of nft', example: [100000000 ]})
    @IsArray()
    prices: number[];

    @ApiProperty({ description: 'The currency address of nft', example: ["0xcC83B44ea968DaE4EC562F0E94fB37937b88db41"] })
    @IsArray()
    currencies: string[];

    @ApiProperty({ description: 'The durations listing in seconds', example: [300] })
    @IsArray()
    durations: number[];

}



export class MintNftDto {
    @IsString()
    gen: string;
}
