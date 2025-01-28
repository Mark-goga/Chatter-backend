import {Field, ObjectType} from '@nestjs/graphql';
import {AbstractEntity} from "../../common/database/abstract.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@ObjectType()
@Schema()
export class Chat extends AbstractEntity {
	@Field()
	@Prop()
	name?: string;

	@Field()
	@Prop()
	isPrivate: boolean;

	@Field(() => [String])
	@Prop([String])
	userIds: string[];

	@Field()
	@Prop()
	userId: string;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);