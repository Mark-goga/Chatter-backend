import {Inject, Injectable} from '@nestjs/common';
import {CreateMessageInput} from "./dto/create-message.input";
import {ChatsRepository} from "../chats.repository";
import {Message} from "./entities/message.entity";
import {Types} from "mongoose";
import {GetMessagesArgs} from "./dto/get-message.args";
import {PUB_SUB} from "../../common/constants/injection-token";
import {PubSub} from "graphql-subscriptions";
import {MESSAGE_CREATED} from "./constants/pubsub-triggers";

@Injectable()
export class MessagesService {
	constructor(
		private readonly ChatsRepository: ChatsRepository,
		@Inject(PUB_SUB) private readonly pubSub: PubSub,
		) {}

	private userChatFilter(userId: string) {
		return {
			$or: [
				{userId},
				{
					userIds: {
						$in: [userId]
					},
				},
			]
		}
	}

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
			...this.userChatFilter(userId),
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
					...this.userChatFilter(userId),
				},
				'Chat')
		).messages;
	}
}
