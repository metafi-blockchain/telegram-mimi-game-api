import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';
import paginate from './plugins/paginate.plugin';
import { MAX_INCUBATE } from 'src/constants/miniapp';


export interface User extends BaseEntity {
}
export enum ROLE  {
    ADMIN, //0
    OPERATOR, //1
    USER //2
}
  
@Schema({ timestamps: true })
export class User  implements BaseEntity {

    @Prop({ type: String })
    name: string;
  
    @Prop({ type: String })
    telegramId: string;
  
    @Prop({ type: String })
    telegramUserName: string;
  
    @Prop({ type: Number })
    telegramAge: number;
  
    @Prop({ type: Number, default: 0 })
    telegramAgePoint: number;
  
    @Prop({ type: Boolean })
    telegramVerified: boolean;
  
    @Prop({ type: Number, default: 0 })
    telegramVerifiedPoint: number;
  
    @Prop({ type: Number, default: 0 })
    telegramReferPoint: number;
  


  
  
    @Prop({ type: Number, default: 0 })
    balance: number;
  
    @Prop({ type: Number, default: 1 })
    level: number;
  
    // @Prop({ type: Number, default: 0 })
    // xFollowerPoint: number;
  
    // @Prop({ type: Number, default: 0 })
    // xReferPoint: number;
  
    @Prop({ type: String })
    referId: string;
  
    @Prop({ type: Number })
    pointReferedTo: number;
  
    // @Prop({ type: Boolean, default: false })
    // telegramChannelJoined: boolean;
  
    // @Prop({ type: Number, default: 0 })
    // gamePoint: number;
  
    @Prop({ type: Number, default: MAX_INCUBATE })
    incubationCanSpent: number;

    @Prop({ type: Number, default: 0 })
    latestIncubationClick: number;
  
    @Prop({ type: String })
    tonWallet: string;
    
    @Prop({ default: 0, type: Number })
    version: number

}

export const UserSchema = SchemaFactory.createForClass(User)


UserSchema.plugin(paginate); // Example plugin