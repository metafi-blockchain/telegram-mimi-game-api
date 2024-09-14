import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../commons/base.entity';
import { NftType } from '../nft-types/nft-types.entity';


export interface NFT extends BaseEntity {

}

export type Attributes = {
    trait_type: string,
    value: string | number
}


export enum NFT_STATUS {
    LISTING_MARKET = 'LISTING_MARKET',
    ACTIVE_IN_GAME = 'ACTIVE_IN_GAME',
    AVAILABLE = 'AVAILABLE',
}

export enum MINT_STATUS  {
    INITIALIZE = 'INITIALIZE',
    SENDING = 'SENDING',
    MINTED = 'MINTED',
    ERROR = 'ERROR',
}
@Schema({ timestamps: true })

export class NFT  implements BaseEntity {

    _id: mongoose.Schema.Types.ObjectId


    @Prop({ type: String, required: true, index: 1 })
    collection_address: string

    @Prop({ type: Number, default: 0 })
    tokenId: number;

    @Prop({ type: String, required: true, unique: true })
    gen: string;

    @Prop({ type: String, default: '' })
    uri: string;

    @Prop({ type: String})
    owner: string;

    @Prop({ type: String})
    price: number;

    @Prop({ type: String})
    currency: string;

    @Prop({ type: Number})
    open_time: number

    @Prop({ type: String, default: MINT_STATUS.INITIALIZE })
    minting_status: MINT_STATUS

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: NftType.name, index: 1 })
    nft_type: NftType

    @Prop({ type: String, default: "" })
    nft_status: NFT_STATUS

    @Prop({ type: Array<Attributes>, default: [] })
    attributes: Attributes[]

    @Prop({ type: Number, default: 0 })
    block_number: number;

}

export const NFTSchema = SchemaFactory.createForClass(NFT)
