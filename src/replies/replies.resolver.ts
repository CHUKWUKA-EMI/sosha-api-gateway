import { HttpCode, Inject, Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from 'src/users/auth.guard';
import {
  CreateReplyInput,
  GetRepliesInput,
  Replies,
  Reply,
  UpdateReplyInput,
} from 'src/graphql';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { RepliesService } from './replies.service';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('RepliesResolver');

@Resolver('Reply')
export class RepliesResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly repliesService: RepliesService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createReply')
  @HttpCode(201)
  async create(@Args('createReplyInput') createReplyInput: CreateReplyInput) {
    try {
      const newReply = await lastValueFrom(
        this.repliesService.create(createReplyInput),
      );
      this.pubsub.publish('newReply', { newReply });
      return newReply as Reply;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('replies')
  @HttpCode(200)
  async findAll(@Args('payload') payload: GetRepliesInput) {
    try {
      return (await lastValueFrom(
        this.repliesService.findAll(payload),
      )) as Replies;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('reply')
  @HttpCode(200)
  async findOne(@Args('id') id: string) {
    try {
      return (await lastValueFrom(this.repliesService.findOne(id))) as Reply;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('updateReply')
  @HttpCode(200)
  async update(@Args('updateReplyInput') updateReplyInput: UpdateReplyInput) {
    try {
      return (await lastValueFrom(
        this.repliesService.update(updateReplyInput),
      )) as Reply;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('removeReply')
  @HttpCode(200)
  async remove(@Args('id') id: string, @Args('userId') userId: string) {
    try {
      return (await lastValueFrom(
        this.repliesService.remove(id, userId),
      )) as Reply;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Subscription('newReply', {
    filter(payload, variables) {
      return payload.newReply.commentId === variables.commentId;
    },
  })
  newReply(@Args('commentId') commentId: string) {
    logger.log(`Subscribing to newReply on comment ${commentId}`);
    return this.pubsub.asyncIterator(`newReply`);
  }
}
