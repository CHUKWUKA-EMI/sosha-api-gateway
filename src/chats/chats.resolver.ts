import { Inject, Logger, Res } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Response } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  Chat,
  Chats,
  CreateChatInput,
  GetChatsInput,
  SearchChatsInput,
  UpdateChatInput,
  UserIsTyping,
} from 'src/graphql';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { ChatsService } from './chats.service';

const logger = new Logger('ChatsResolver');

@Resolver('Chat')
export class ChatsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly chatsService: ChatsService,
  ) {}

  @Mutation('createChat')
  create(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Res() res: Response,
  ) {
    return this.chatsService.create(createChatInput).subscribe({
      next: (chat: Chat) => {
        this.pubsub.publish('newChat', { newChat: chat });
        return res.status(201).json(chat);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Query('chats')
  findAll(@Res() res: Response, @Args('payload') payload: GetChatsInput) {
    return this.chatsService.getChats(payload).subscribe({
      next: (chats: Chats) => {
        return res.status(200).json(chats);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Query('searchChats')
  searchChats(
    @Res() res: Response,
    @Args('payload') payload: SearchChatsInput,
  ) {
    return this.chatsService.searchChats(payload).subscribe({
      next: (chats: Chats) => {
        return res.status(200).json(chats);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Query('chat')
  findOne(@Res() res: Response, @Args('id') id: string) {
    return this.chatsService.getChat(id).subscribe({
      next: (chat: Chat) => {
        return res.status(200).json(chat);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Mutation('updateChat')
  update(
    @Res() res: Response,
    @Args('updateChatInput') updateChatInput: UpdateChatInput,
  ) {
    return this.chatsService.update(updateChatInput).subscribe({
      next: (chat: Chat) => {
        return res.status(200).json(chat);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Mutation('deleteChat')
  remove(@Args('id') id: string, @Res() res: Response) {
    return this.chatsService.remove(id).subscribe({
      next: (chat: Chat) => {
        return res.status(200).json(chat);
      },
      error: (err: any) => {
        logger.error(err);
        throw new Error(err);
      },
    });
  }

  @Mutation('userIsTyping')
  isTyping(
    @Args('friendshipId') friendshipId: number,
    @Args('receiverId') receiverId: string,
    @Args('senderFirstName') senderFirstName: string,
    @Args('senderLastName') senderLastName: string,
    @Res() res: Response,
  ) {
    return this.chatsService
      .userIsTyping(friendshipId, receiverId, senderFirstName, senderLastName)
      .subscribe({
        next: (data: UserIsTyping) => {
          this.pubsub.publish('userIsTyping', { userIsTyping: data });
          return res.status(200).json(data);
        },
        error: (err: any) => {
          logger.error(err);
          throw new Error(err);
        },
      });
  }

  @Subscription('newChat', {
    filter: (payload, variables) => {
      return payload.newChat.friendshipId === variables.friendshipId;
    },
  })
  newChat(@Args('friendshipId') friendshipId: number) {
    logger.log(`newChat subscription for friendshipId: ${friendshipId}`);
    return this.pubsub.asyncIterator('newChat');
  }

  @Subscription('userIsTyping', {
    filter: (payload, variables) => {
      return (
        payload.userIsTyping.friendshipId === variables.friendshipId &&
        payload.userIsTyping.receiverId === variables.receiverId
      );
    },
  })
  userIsTyping(
    @Args('friendshipId') friendshipId: number,
    @Args('receiverId') receiverId: string,
  ) {
    logger.log(
      `userIsTyping subscription for friendshipId: ${friendshipId} and receiverId: ${receiverId}`,
    );
    return this.pubsub.asyncIterator('userIsTyping');
  }
}
