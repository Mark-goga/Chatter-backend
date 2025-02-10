import {Inject, Injectable} from '@nestjs/common';
import {CreateMessageInput} from "./dto/create-message.input";
import {ChatsRepository} from "../chats.repository";
import {Message} from "./entities/message.entity";
import {Types} from "mongoose";
import {GetMessagesArgs} from "./dto/get-message.args";
import {PUB_SUB} from "../../common/constants/injection-token";
import {PubSub} from "graphql-subscriptions";
import {MESSAGE_CREATED} from "./constants/pubsub-triggers";
import {MessageCreatedArgs} from "./dto/message-created.args";
import {ChatsService} from "../chats.service";

@Injectable()
export class MessagesService {
	constructor(
		private readonly ChatsRepository: ChatsRepository,
		private readonly chatsService: ChatsService,
		@Inject(PUB_SUB) private readonly pubSub: PubSub,
		) {}

	async createMessage({content, chatId}: CreateMessageInput, userId: string) {
		const message: Message = {
			content,
			chatId,
			userId,
			createdAt: new Date(),
			_id: new Types.ObjectId(),
		}
		await this.ChatsRepository.findOneAndUpdate({
			_id: chatId,
			...this.chatsService.userChatFilter(userId),
		}, {
			$push: {
				messages: message
			}
		});
		await this.pubSub.publish(MESSAGE_CREATED, {
			messageCreated: message,
		})
		return message;
	}

	async getMessages({chatId}: GetMessagesArgs, userId: string) {
		return (
			await this.ChatsRepository.findOne(
				{
					_id: chatId,
					...this.chatsService.userChatFilter(userId),
				},
				'Chat')
		).messages;
	}

	async messageCreated({chatId}: MessageCreatedArgs, userId: string) {
		await this.ChatsRepository.findOne({
			_id: chatId,
			...this.chatsService.userChatFilter(userId),
		}, 'Chat');
		return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
	}
}
