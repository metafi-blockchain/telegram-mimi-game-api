

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
    @IsString()
    nftAddress: string;

    @IsArray()
    tokenIds: number[];

    @IsArray()
    prices: number[];

    @IsArray()
    currencies: string[];

    @IsArray()
    durations: number[];

}

export class ListNftsByGensDto {
    @IsString()
    nftAddress: string;

    @IsArray()
    gens: string[];

    @IsArray()
    prices: number[];

    @IsArray()
    currencies: string[];

    @IsArray()
    durations: number[];

}



export class MintNftDto {
    @IsString()
    gen: string;
}