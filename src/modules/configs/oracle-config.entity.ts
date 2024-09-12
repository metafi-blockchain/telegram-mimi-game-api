import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../commons/base.entity';


export interface OracleConfig extends BaseEntity {

}
@Schema({ timestamps: true })

export class OracleConfig  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String})
    private_key_hash: string;

    @Prop({ type: Number})
    block_number: number;

    

}

export const OracleConfigSchema = SchemaFactory.createForClass(OracleConfig)
