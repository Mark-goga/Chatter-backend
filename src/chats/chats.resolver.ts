import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import {GqlAuthGuard} from "../auth/guards/gql-auth.guard";
import {UseGuards} from "@nestjs/common";
import {TokenPayload} from "../auth/token-payload.interface";
import {CurrentUser} from "../auth/current-user.decorator";

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation(() => Chat)
  @UseGuards(GqlAuthGuard)
  createChat(
    @CurrentUser() user: TokenPayload,
    @Args('createChatInput') createChatInput: CreateChatInput
  ) {
    return this.chatsService.create(createChatInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Chat], { name: 'chats' })
  findAll(@CurrentUser() user: TokenPayload) {
    return this.chatsService.findAll(user._id);
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('_id') _id: string) {
    return this.chatsService.findOne(_id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.remove(id);
  }
}
