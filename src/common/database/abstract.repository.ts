import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(public readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>, message: string): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean<TDocument>();

    if (!document) {
      this.logger.warn('document not found with filterQuery', filterQuery);
      throw new NotFoundException(`${message} not found`);
    }

    return document;
  }

  async findOneWithoutThrowError(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean<TDocument>();

    if (!document) {
      this.logger.warn('document not found with filterQuery', filterQuery);
    }

    return document;
  }

  async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, { new: true }).lean<TDocument>();

    if (!document) {
      this.logger.warn('document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>();
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>();
  }
}