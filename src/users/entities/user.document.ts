import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';

@Schema({versionKey: false})
export class UserDocument extends AbstractEntity {
	@Prop({type: String})
	email: string;

	@Prop()
	username: string;

	@Prop({type: String})
	password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);