import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';


export interface User extends BaseEntity {
    username: string;
    email: string;
}
  
@Schema({ timestamps: true })
export class User  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String, required: true, unique: true })
    username: string;
    @Prop({ default: false, required: true, unique: true })
    email: string;
    @Prop({ default: false, type: Boolean })
    administrator: boolean
    
    @Prop({ default: 0, type: Number })
    version: number

}

export const UserSchema = SchemaFactory.createForClass(User)
