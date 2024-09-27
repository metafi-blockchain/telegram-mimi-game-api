// src/schemas/weekly-friend.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../commons/base.entity';

// Define the WeeklyFriend document interface
export type WeeklyFriendDocument = WeeklyFriend & Document;

export interface WeeklyFriend extends BaseEntity {
}
@Schema() // Marks this as a schema
export class WeeklyFriend implements BaseEntity {
  @Prop({ type: String })
  telegramId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  friends: number;

  @Prop({ type: Boolean, default: true })
  is_enable: boolean;

  @Prop({ type: Number })
  start_date: number;

  @Prop({ type: Number })
  end_date: number;
}

// Create the schema factory
export const WeeklyFriendSchema = SchemaFactory.createForClass(WeeklyFriend);