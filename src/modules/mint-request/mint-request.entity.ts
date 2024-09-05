import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';


export interface MintRequest extends BaseEntity {

}


export enum STATUS {
    SUBMITTING = 'SUBMITTING',
    DONE = 'DONE',
}
@Schema({ timestamps: true })

export class MintRequest  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String, required: true, unique: true })

    @Prop({ type: String, required: true, unique: true })
    gen: string;
    @Prop({ type: String, default: STATUS.SUBMITTING})
    status: STATUS
}

export const MintRequestSchema = SchemaFactory.createForClass(MintRequest)
