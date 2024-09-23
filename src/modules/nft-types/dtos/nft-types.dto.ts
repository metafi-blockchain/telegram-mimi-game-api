

import {IsNumber, IsString} from 'class-validator'


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
    @IsNumber()
    chainId: number;
}

