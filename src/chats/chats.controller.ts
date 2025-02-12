import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtRefreshAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ChatsService} from "./chats.service";

@Controller('chats')
export class ChatsController {

	constructor(private readonly chatsService: ChatsService) {}

	@Get('count')
	@UseGuards(JwtRefreshAuthGuard)
	async countChats() {
			return this.chatsService.countChats();
	}

}
