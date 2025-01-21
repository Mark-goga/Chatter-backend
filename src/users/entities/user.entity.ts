import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({versionKey: false})
@ObjectType()
export class User extends AbstractEntity {
  @Prop({type: String})
  @Field()
  email: string;

  @Prop({type: String})
  password: string;
}

export const UserEntity = SchemaFactory.createForClass(User);