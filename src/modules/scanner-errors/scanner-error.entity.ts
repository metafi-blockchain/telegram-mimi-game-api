import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';
import { NftType } from '../nft-types/nft-types.entity';


export interface ScannerError extends BaseEntity {

}



export enum SCAN_STATUS  {
    ERROR = 'ERROR',
    SUCCEED = 'SUCCEED',
}
@Schema({ timestamps: true })

export class ScannerError  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: Number, default: 0 })
    chainId: number;


    @Prop({ type: Number, default: 0 })
    from_block_number: number;

    @Prop({ type: Number, default: 0 })
    to_block_number: number;

    @Prop({ type: String, default: '' })
    error_message: string;

    @Prop({ type: String, default: SCAN_STATUS.ERROR })
    status: SCAN_STATUS;

}

export const ScannerErrorSchema = SchemaFactory.createForClass(ScannerError)
