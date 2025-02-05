import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {MessagesService} from './messages.service';
import {Message} from "./entities/message.entity";
import {CreateMessageInput} from "./dto/create-message.input";
import {CurrentUser} from "../../auth/current-user.decorator";
import {TokenPayload} from "../../auth/token-payload.interface";
import {Inject, UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../auth/guards/gql-auth.guard";
import {GetMessagesArgs} from "./dto/get-message.args";
import {PUB_SUB} from "../../common/constants/injection-token";
import {PubSub} from "graphql-subscriptions";
import {MESSAGE_CREATED} from "./constants/pubsub-triggers";
import {MessageCreatedArgs} from "./dto/message-created.args";

@Resolver(() => Message)
export class MessagesResolver {

  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly  pubSub: PubSub
  ) {}

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

  @Subscription(() => Message, {
    filter:(payload, variables) => {
      return payload.messageCreated.chatId === variables.chatId;
    }
  })
  messageCreated(
    @Args() _messageCreatedArgs: MessageCreatedArgs,
  ) {
    this.pubSub.asyncIterableIterator(MESSAGE_CREATED)
  }
}
