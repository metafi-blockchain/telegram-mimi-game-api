import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../commons/base.entity';


export interface OracleConfig extends BaseEntity {

}
@Schema({ timestamps: true })

export class OracleConfig  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId
    @Prop({ type: String, required: true, unique: true })
    private_key_hash: string;

}

export const OracleConfigSchema = SchemaFactory.createForClass(OracleConfig)
