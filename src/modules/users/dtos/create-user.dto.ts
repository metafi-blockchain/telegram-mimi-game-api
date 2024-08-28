

import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
export class CreateUserDto {

    name?: string;

    // @IsNotEmpty()
    uuid: string;

    @IsEmail()
    email: string;

    password?: string;

    @IsString()
    provider?: string

    avatar?: string
}