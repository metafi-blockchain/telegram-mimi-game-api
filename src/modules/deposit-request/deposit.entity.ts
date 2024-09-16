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
    PENDING = 'PENDING',
    DONE = 'DONE',
    ERROR = 'ERROR',
}
@Schema({ timestamps: true })

export class Deposit  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: Number, default: 0 })
    packageId: number;
    @Prop({ type: String})
    wallet: string;
    @Prop({ type: String})
    amount: number;
    @Prop({ type: String})
    currency: string;
    @Prop({ type: Number})
    time: number
    @Prop({ type: String, default: DEPOSIT_STATUS.PENDING })
    status: DEPOSIT_STATUS;
    @Prop({ type: Number, default: 0 })
    block_number: number;

}

export const DepositSchema = SchemaFactory.createForClass(Deposit)