

import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
export class AuthSocialDto {
    @IsEmail()
    email: string;

    provider?: string

    avatar?: string

    displayName?: string

}

export class AuthDto {
    @ApiProperty({ description: 'The email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password' })
    @IsNotEmpty()
    password: string;
}

export class AuthAddressDto {

    @IsNotEmpty()
    dataSigned: IMessageSinged;

    @IsNotEmpty()
    type: string;
}

export interface IMessageSinged {
	messageBytes: string, 
	signature: string
}

export interface IVerifyEmail {
	opt: string
}