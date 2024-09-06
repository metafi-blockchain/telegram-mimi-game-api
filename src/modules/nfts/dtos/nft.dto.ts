

import {IsString} from 'class-validator'


export class CreateNftDto {

    @IsString()
    uri: string;
    @IsString()
    collection_address: string;
    @IsString()
    owner: string;
    @IsString()
    gen: string;
    @IsString()
    name?: string;
}



export class MintNftDto {
    @IsString()
    gen: string;
}

