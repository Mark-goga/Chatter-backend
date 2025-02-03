import {Field, ObjectType} from '@nestjs/graphql';
import {AbstractEntity} from "../../common/database/abstract.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Message} from "../messages/entities/message.entity";

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

	@Prop([Message])
	messages: Message[];
}
export const ChatSchema = SchemaFactory.createForClass(Chat);