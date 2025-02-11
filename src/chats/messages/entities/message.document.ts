import {AbstractEntity} from "../../../common/database/abstract.entity";
import {Prop, Schema} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({versionKey: false})
export class MessageDocument extends AbstractEntity {
	@Prop()
	content: string;

	@Prop()
	createdAt: Date;

	@Prop()
	userId: Types.ObjectId;
}