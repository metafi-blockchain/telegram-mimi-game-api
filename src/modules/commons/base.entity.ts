import { Schema, Document } from 'mongoose';
import { User } from '../users/user.entity';

export interface BaseEntity extends Document {
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  updatedBy: User;
}

export const BaseEntitySchema = new Schema<BaseEntity>({
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

BaseEntitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});