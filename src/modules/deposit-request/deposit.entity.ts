import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../commons/base.entity';


export interface Deposit extends BaseEntity {

}




export enum NFT_STATUS {
    LISTING_MARKET = 'LISTING_MARKET',
    ACTIVE_IN_GAME = 'ACTIVE_IN_GAME',
    AVAILABLE = 'AVAILABLE',
}

export enum DEPOSIT_STATUS  {
    INITIALIZE = 'INITIALIZE',
    DONE = 'DONE',
    ERROR = 'ERROR',
}
@Schema({ timestamps: true })

export class Deposit  implements BaseEntity {


    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: Number, default: 0 })
    package_id: number;
    @Prop({ type: String})
    wallet: string;
    @Prop({ type: String})
    amount: number;
    @Prop({ type: String})
    currency: string;
    @Prop({ type: Number})
    time: number
    @Prop({ type: String, default: DEPOSIT_STATUS.INITIALIZE })
    status: DEPOSIT_STATUS;
    @Prop({ type: Number, default: 0 })
    block_number: number;
    @Prop({ type: String, unique: true })
    transaction_hash: string;
    @Prop({ type: Number, default: 0 })
    chain_id: number;

}

export const DepositSchema = SchemaFactory.createForClass(Deposit)
