import {Injectable, Logger} from "@nestjs/common";
import {AbstractRepository} from "../common/database/abstract.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ChatDocument} from "./entities/chat.document";
import {Chat} from "./entities/chat.entity";

@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {

	protected readonly logger = new Logger(ChatsRepository.name);

	constructor(@InjectModel(Chat.name) chatsModel: Model<ChatDocument>) {
		super(chatsModel);
	}
}
