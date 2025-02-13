import {Inject, Injectable} from '@nestjs/common';
import {CreateMessageInput} from "./dto/create-message.input";
import {ChatsRepository} from "../chats.repository";
import {Message} from "./entities/message.entity";
import {Types} from "mongoose";
import {GetMessagesArgs} from "./dto/get-message.args";
import {PUB_SUB} from "../../common/constants/injection-token";
import {PubSub} from "graphql-subscriptions";
import {MESSAGE_CREATED} from "./constants/pubsub-triggers";
import {MessageDocument} from "./entities/message.document";
import {UsersService} from "../../users/users.service";

@Injectable()
export class MessagesService {
	constructor(
		private readonly ChatsRepository: ChatsRepository,
		private readonly usersService: UsersService,
		@Inject(PUB_SUB) private readonly pubSub: PubSub,
	) {}

	async createMessage({content, chatId}: CreateMessageInput, userId: string) {
		const messageDocument: MessageDocument = {
			content,
			userId: new Types.ObjectId(userId),
			createdAt: new Date(),
			_id: new Types.ObjectId(),
		}
		await this.ChatsRepository.findOneAndUpdate({
			_id: chatId,
		}, {
			$push: {
				messages: messageDocument,
			}
		});

		const message: Message = {
			...messageDocument,
			chatId,
			user: await this.usersService.findOne(userId),
		};

		await this.pubSub.publish(MESSAGE_CREATED, {
			messageCreated: message,
		})
		return message;
	}

	async getMessages({chatId, limit, skip}: GetMessagesArgs) {
		return this.ChatsRepository.model.aggregate([
			{$match: {_id: new Types.ObjectId(chatId)}},
			{$unwind: '$messages'},
			{$replaceRoot: {newRoot: '$messages'}},
			{ $sort: { createdAt: -1 } },
			{$skip: skip},
			{$limit: limit},
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: "_id",
					as: 'user'
				},
			},
			{$unwind: '$user'},
			{$unset: 'userId'},
			{$set: {chatId}}
		]);
	}

	async messageCreated() {
		return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
	}

	async countMessages(chatId: string) {
		return (
			await this.ChatsRepository.model.aggregate([
			{$match: {_id: new Types.ObjectId(chatId)}},
			{$unwind: '$messages'},
			{$count: 'messages'}
		])
		)[0];

	}

}
