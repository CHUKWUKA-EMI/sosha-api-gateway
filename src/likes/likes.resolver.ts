import { HttpCode, Inject, Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from 'src/users/auth.guard';
import {
  CreatereactionInput,
  Reaction,
  Reactions,
  ReactionsPagination,
} from 'src/graphql';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { LikesService } from './likes.service';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('LikesResolver');

@Resolver('Reaction')
export class LikesResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly likesService: LikesService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('addReaction')
  @HttpCode(201)
  async create(
    @Args('createReactionInput') createReactionInput: CreatereactionInput,
  ) {
    try {
      const newReaction = (await lastValueFrom(
        this.likesService.create(createReactionInput),
      )) as Reaction;
      this.pubsub.publish('newReaction', { newReaction });
      return newReaction;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('postReactions')
  @HttpCode(200)
  async findAll(
    @Args('paginationPayload') paginationPayload: ReactionsPagination,
  ) {
    try {
      return (await lastValueFrom(
        this.likesService.findPostReactions(paginationPayload),
      )) as Reactions;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Subscription('newReaction', {
    filter: (payload, variables) => {
      return payload.newReaction.postId === variables.postId;
    },
  })
  newReaction(@Args('postId') postId: string) {
    logger.log(`new Reaction on post: ${postId}`);
    return this.pubsub.asyncIterator('newReaction');
  }
}
