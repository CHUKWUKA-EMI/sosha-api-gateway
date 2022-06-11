import { HttpCode, Inject, Logger, Res } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Response } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { lastValueFrom } from 'rxjs';
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
  @HttpCode(201)
  async create(
    @Args('createChatInput') createChatInput: CreateChatInput,
  ) {

    try {
      const chat = await lastValueFrom(this.chatsService.create(createChatInput))
      this.pubsub.publish('newChat', { newChat: chat });
      return chat
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Query('chats')
  @HttpCode(200)
  async findAll(@Args('payload') payload: GetChatsInput) {
    try {
      const chats = await lastValueFrom(this.chatsService.getChats(payload))
      return chats
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Query('searchChats')
  @HttpCode(200)
  async searchChats(
    @Args('payload') payload: SearchChatsInput,
  ) {
    try {
      const chats = await lastValueFrom(this.chatsService.searchChats(payload))
      return chats
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Query('chat')
  @HttpCode(200)
  async findOne(@Args('id') id: string) {

    try {
      return await lastValueFrom(this.chatsService.getChat(id))
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Mutation('updateChat')
  @HttpCode(200)
  async update(
    @Args('updateChatInput') updateChatInput: UpdateChatInput,
  ) {

    try {
      return await lastValueFrom(this.chatsService.update(updateChatInput))
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Mutation('deleteChat')
  @HttpCode(200)
  async remove(@Args('id') id: string) {
    try {
      return await lastValueFrom(this.chatsService.remove(id))
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Mutation('userIsTyping')
  @HttpCode(200)
  async isTyping(
    @Args('friendshipId') friendshipId: number,
    @Args('receiverId') receiverId: string,
    @Args('senderFirstName') senderFirstName: string,
    @Args('senderLastName') senderLastName: string,
  ) {

      try {
        const data= await lastValueFrom(this.chatsService
          .userIsTyping(friendshipId, receiverId, senderFirstName, senderLastName))
          this.pubsub.publish('userIsTyping', { userIsTyping: data });
        return data
      } catch (error) {
        logger.error(error);
        return new Error(error.error);
      }
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
