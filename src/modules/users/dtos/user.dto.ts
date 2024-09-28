import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";
import { IUser } from "src/interface/user.interface";
import { IMessageSinged } from "src/modules/authentication/dto/login.dto";


export class UserDto {


    @Expose()
    address: string
    @Expose()
    version: number ;
    @Expose()
    email: string;
    @Expose()
    role: number;

}

export class ChangePwdDto {

    new_password: string;
    old_password: string;
    confirm_new_password: string;
}

export class 
updateAddressDto {

    @IsNotEmpty()
    dataSigned: IMessageSinged;

    @IsNotEmpty()
    type: string;

    address?: string;
}