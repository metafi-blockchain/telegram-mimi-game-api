import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';

//@Exclude() //hide property when get info
@Schema()
export class ActivityLog{
    @Prop()
    methods: string
    
    @Prop()
    account: string

    @Prop({ required: true })
    ipAddress: string

    @Prop({ required: true })
    path: string

    @Prop()
    data: string;

}

export const ActivityLogSchema =  SchemaFactory.createForClass(ActivityLog)