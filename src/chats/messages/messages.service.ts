import { Injectable } from '@nestjs/common';
import {CreateMessageInput} from "./dto/create-message.input";
import {ChatsRepository} from "../chats.repository";
import {Message} from "./entities/message.entity";
import {Types} from "mongoose";

@Injectable()
export class MessagesService {
	constructor(private readonly ChatsRepository: ChatsRepository) {
	}

	async createMessage({content, chatId}: CreateMessageInput, userId: string) {
		const message: Message = {
			content,
			userId,
			createdAt: new Date(),
			_id: new Types.ObjectId(),
		}
		await this.ChatsRepository.findOneAndUpdate({
			_id: chatId,
			$or: [
				{userId},
				{userIds: {
						$in: [userId]
					},
				},
			],
		}, {
			$push: {
				messages: message
			}
		});

		return message;
	}
}
