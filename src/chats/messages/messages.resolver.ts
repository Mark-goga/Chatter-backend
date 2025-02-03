import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {MessagesService} from './messages.service';
import {Message} from "./entities/message.entity";
import {CreateMessageInput} from "./dto/create-message.input";
import {CurrentUser} from "../../auth/current-user.decorator";
import {TokenPayload} from "../../auth/token-payload.interface";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../auth/guards/gql-auth.guard";
import {GetMessagesArgs} from "./dto/get-message.args";

@Resolver(() => Message)
export class MessagesResolver {

  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id)
  }

  @Query(() => [Message], {name : 'messages'})
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }

}
