import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';


export interface NftType extends BaseEntity {

}


export enum TRANSACTION {
    SUBMITTING = 'SUBMITTING',
    SENDING = 'SENDING',
    DONE = 'DONE',
    ERROR = 'ERROR',
}
@Schema({ timestamps: true })

export class NftType  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String, required: true, unique: true })
    name: string;
    @Prop({ type: String, required: true, unique: true })
    symbol: string;
    @Prop({ type: String, default: '' })
    nft_address: string;
    @Prop({ default: 0, type: Number })
    salt: number;
    @Prop({ type: String, default: '' })
    owner: string;

    @Prop({ type: String, default: TRANSACTION.SENDING })
    status: TRANSACTION

    @Prop({ default: false, type: Boolean })
    is_active: boolean;

    @Prop({ default: false, type: Boolean })
    type: string    ;
    
    @Prop({ type: String, default: '',  unique: true  })
    transaction_hash: string;
    

}

export const NftTypeSchema = SchemaFactory.createForClass(NftType)
