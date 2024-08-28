import { IsEmail, IsEmpty, IsNotEmpty, IsObject, IsString,  } from "class-validator"
import { ISocial } from "src/interface/social.interface";


export class UpdateUserDto {

    
    @IsNotEmpty()
    display_name?: string;

    @IsString()
    avatar?: string;
    @IsString()
    move_addresses?: string;
    @IsString()
    erc20_addresses?: string;
    @IsObject()
    socials?: ISocial;
    @IsString()
    bio?: string;

}