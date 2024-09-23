import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';


export interface User extends BaseEntity {
    username: string;
    email: string;
}
export enum ROLE  {
    ADMIN, //0
    OPERATOR, //1
    USER //2
}
  
@Schema({ timestamps: true })
export class User  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId



    @Prop({ default: false, required: true, unique: true })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: String, default: '' })
    address: string;


    @Prop({ type: String, default: '' })
    name: string;


    @Prop({ default: false, type: Boolean })
    administrator: boolean;

    @Prop({ type: String, enum: ROLE, default: ROLE.USER })
    role: number;


    @Prop({ type: String, default: '' })
    telegram_user: string;
    
    @Prop({ default: 0, type: Number })
    version: number

}

export const UserSchema = SchemaFactory.createForClass(User)
