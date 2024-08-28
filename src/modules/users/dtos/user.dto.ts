import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";
import { IUser } from "src/interface/user.interface";
import { IMessageSinged } from "src/modules/authentication/dto/login.dto";


export class UserDto implements IUser{

    @Expose({ name: "_id" })
    @Transform((value) => value?.obj?._id)
    _id: ObjectId;
    @Expose()
    address: string
    @Expose()
    version?: number ;

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