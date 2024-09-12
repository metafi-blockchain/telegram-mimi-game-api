import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';
import { NftType } from '../nft-types/nft-types.entity';


export interface EventLogHistory extends BaseEntity {

}

@Schema({ timestamps: true })

export class EventLogHistory  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId

    @Prop({ type: String, required: true })
    transaction_hash: string

    @Prop({ type: String, required: true, index: 1})
    contract_address: string;

    @Prop({ type: String, default: '' })
    from: string;

    @Prop({ type: String, index: 1 })
    to: string;

    @Prop({ type: Number, default: 0 })
    value: number;

    @Prop({ type: String, default: '' })
    log_data: string;  
    
    @Prop({ type: String, default: '' })
    event_type: string;

    @Prop({ type: String, default: '' })
    block_hash: string;

    @Prop({ type: Number, default: 0 })
    block_number: number;

}

export const EventLogHistorySchema = SchemaFactory.createForClass(EventLogHistory)
