import { Schema, Document } from 'mongoose';

export interface BaseEntity extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export const BaseEntitySchema = new Schema<BaseEntity>({
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