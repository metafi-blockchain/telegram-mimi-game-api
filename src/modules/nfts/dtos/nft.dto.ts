

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
}



export class MintNftDto {
    @IsString()
    gen: string;
}

