import {AbstractEntity} from "../../common/database/abstract.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MessageDocument} from "../messages/entities/message.document";

@Schema({versionKey: false})
export class ChatDocument extends AbstractEntity {
	@Prop()
	name: string;

	@Prop()
	userId: string;

	@Prop([MessageDocument])
	messages: MessageDocument[];
}
export const ChatSchema = SchemaFactory.createForClass(ChatDocument);