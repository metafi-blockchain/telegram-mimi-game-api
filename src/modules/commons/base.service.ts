import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  // Find all entities
  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  // Find entities based on a condition
  async find(cond: FilterQuery<T>): Promise<T[]> {
    return this.model.find(cond).exec();
  }

  // Find an entity by ID and throw an exception if not found
  async findById(id: string): Promise<T> {
    return this.throwIfNotFound(await this.model.findById(id).exec(), id);
  }

  // Find one entity based on a condition
  async findOneWithCondition(cond: FilterQuery<T>): Promise<T> {
    return this.model.findOne(cond).exec();
  }

  // Create a new entity
  async create(createDto: Partial<T>): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save();
  }

  // Aggregation pipeline
  async aggregate(cond: any): Promise<T[]> {
    return this.model.aggregate(cond).exec();
  }

  // Delete an entity by ID and throw an exception if not found
  async delete(id: string): Promise<T> {
    return this.throwIfNotFound(await this.model.findByIdAndDelete(id).exec(), id);
  }

  // Update an entity and throw an exception if not found
  async update(cond: FilterQuery<T>, attrs: UpdateQuery<T>): Promise<T> {  
    const updatedEntity = await this.model.findOneAndUpdate(cond, { $set: attrs }, { new: true }).exec();
    return this.throwIfNotFound(updatedEntity, 'condition not met');
  }

  // Count documents based on a condition
  async count(cond: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(cond).exec();
  }

  // Create a new entity with a transaction
  async createWithTransaction(createDto: Partial<T>): Promise<T> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    try {
      const createdEntity = new this.model(createDto);
      await createdEntity.save({ session });
      await session.commitTransaction();
      return createdEntity;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Helper method to throw NotFoundException if the entity is not found
  private throwIfNotFound(entity: T | null, id: string): T {
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }
}