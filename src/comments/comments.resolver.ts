import { HttpCode, Inject, Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from 'src/users/auth.guard';
import {
  Comment,
  Comments,
  CreateCommentInput,
  UpdateCommentInput,
} from 'src/graphql';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { CommentsService } from './comments.service';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('CommentsResolver');

@Resolver('Comment')
export class CommentsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createComment')
  @HttpCode(201)
  async create(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    try {
      const newComment = await lastValueFrom(
        this.commentsService.create(createCommentInput),
      );
      this.pubsub.publish('newComment', { newComment });
      return newComment;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('comments')
  @HttpCode(200)
  async findAll(
    @Args('postId') postId: string,
    @Args('page') page?: number,
    @Args('limit') limit?: number,
  ) {
    try {
      return (await lastValueFrom(
        this.commentsService.findAll(postId, page, limit),
      )) as Comments;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('userComments')
  @HttpCode(200)
  async userComments(
    @Args('userId') userId: string,
    @Args('page') page?: number,
    @Args('limit') limit?: number,
  ) {
    try {
      return (await lastValueFrom(
        this.commentsService.findByUser(userId, page, limit),
      )) as Comments;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('comment')
  @HttpCode(200)
  async findOne(@Args('id') id: string) {
    try {
      return (await lastValueFrom(this.commentsService.findOne(id))) as Comment;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('updateComment')
  @HttpCode(200)
  async update(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    try {
      return (await lastValueFrom(
        this.commentsService.update(updateCommentInput),
      )) as Comment;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteComment')
  @HttpCode(200)
  async remove(@Args('id') id: string, @Args('userId') userId: string) {
    try {
      return (await lastValueFrom(
        this.commentsService.remove(id, userId),
      )) as Comment;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Subscription('newComment', {
    filter: (payload, variables) => {
      return payload.newComment.postId === variables.postId;
    },
  })
  newComment(@Args('postId') postId: string) {
    logger.log(`Subscribing to newComment on post ${postId}`);
    return this.pubsub.asyncIterator('newComment');
  }
}
