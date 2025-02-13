import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import {JwtRefreshAuthGuard} from "../auth/guards/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {TokenPayload} from "../auth/token-payload.interface";
import {CurrentUser} from "../auth/current-user.decorator";
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) {
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Post('image')
	@UseInterceptors(FileInterceptor('file'))
	async uploadProfilePicture(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({maxSize: 100000}),
					new FileTypeValidator({fileType: "image/jpg"})
				],
			}),
		) file: Express.Multer.File,
		@CurrentUser() user: TokenPayload,
	) {
		return this.usersService.uploadImage(file.buffer, user._id);
	}

}
