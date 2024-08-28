import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../commons/base.service';
import { User } from './user.entity';


@Injectable()
export class UsersService extends BaseService<User>{

    constructor(@InjectModel(User.name) private userModel: Model<User>){
        super(userModel)
    };


    async findOne(email: string){

        const user = await this.userModel.findOne({email}).exec()

        if(!user){
            throw new NotFoundException('User Not found!')
        }
        return user;
    }

    async findByUuid(uuid: string) :Promise<User> {

        const user = await this.userModel.findOne({uuid}).exec()

        if(!user){
            throw new NotFoundException('User Not found!')
        }
        return user;
    }

    async findById(id: string) :Promise<User> {

        const user = await this.userModel.findById(id).exec()

        if(!user){
            throw new NotFoundException('User Not found!')
        }
        return user;
    }


     update(cond: any, attrs: Partial<User>){
        return this.userModel.findOneAndUpdate(cond, {$set: attrs}, {new: true} ).exec();
    }


    logout(user: User){
        const {_id, version} = user;
        return this.userModel.findByIdAndUpdate(_id, {version: version + 1}).exec() ; 
    }




}
