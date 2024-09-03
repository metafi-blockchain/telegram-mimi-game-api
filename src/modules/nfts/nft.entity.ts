import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';


export interface RequestMint extends BaseEntity {

}


export enum NFT_STATUS {
    SENDING = 'SENDING',
    MINTED = 'MINTED',
    ACTIVE_IN_GAME = 'ACTIVE_IN_GAME',
    APPROVED = 'APPROVED',
    DONE = 'DONE',
    ERROR = 'ERROR',
}
@Schema({ timestamps: true })

export class RequestMint  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String, required: true, unique: true })

    @Prop({ type: String, required: true, unique: true })
    gen: string;
    @Prop({ type: String, default: NFT_STATUS.SENDING })
    status: NFT_STATUS

    @Prop({ default: false, type: Boolean })
    is_active: boolean;

    owner: string;



}

export const RequestMintSchema = SchemaFactory.createForClass(RequestMint)
