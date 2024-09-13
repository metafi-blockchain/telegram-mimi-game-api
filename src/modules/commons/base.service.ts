import { Model, Document } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async find(cond: any): Promise<T[]> {
    return this.model.find(cond).exec();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.model.findById(id).exec();
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  finOneWithCondition(cond: any): Promise<T> {
    return this.model.findOne(cond).exec();
  }

  create(createDto: any): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save();
  }

  aggregate(cond: any): Promise<T[]>  {
    return this.model.aggregate(cond).exec();
  }
  async delete(id: string): Promise<T> {
    const deletedEntity = await this.model.findByIdAndDelete(id).exec();
    if (!deletedEntity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return deletedEntity;
  }



  update(cond: any, attrs: Partial<T>){
    return this.model.findOneAndUpdate(cond, {$set: attrs}, {new: true} ).exec();
}
}