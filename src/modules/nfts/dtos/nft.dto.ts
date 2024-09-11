

import {IsString} from 'class-validator'
import { Attributes } from '../nft.entity';


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

    attributes?: Attributes[];
}



export class MintNftDto {
    @IsString()
    gen: string;
}

