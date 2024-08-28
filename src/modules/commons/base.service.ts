import { Model, Document } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.model.findById(id).exec();
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: any): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save();
  }

  async update(id: string, updateDto: any): Promise<T> {
    const updatedEntity = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedEntity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return updatedEntity;
  }

  aggregate(cond: any): any {
    return this.model.aggregate(cond);
  }
  async delete(id: string): Promise<T> {
    const deletedEntity = await this.model.findByIdAndDelete(id).exec();
    if (!deletedEntity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return deletedEntity;
  }
}