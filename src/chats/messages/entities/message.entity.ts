import {Field, ObjectType} from "@nestjs/graphql";
import {AbstractEntity} from "../../../common/database/abstract.entity";
import {Prop, Schema} from "@nestjs/mongoose";

@ObjectType()
@Schema({versionKey: false})
export class Message extends AbstractEntity {
	@Field()
	@Prop()
	content: string;

	@Field()
	@Prop()
	createdAt: Date;

	@Field()
	@Prop()
	userId: string;

	@Field()
	@Prop()
	chatId: string;
}