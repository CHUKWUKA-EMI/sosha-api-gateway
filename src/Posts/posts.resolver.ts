import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { HttpCode, Inject, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CreatePostInput, Post, Posts, UpdatePostInput } from 'src/graphql';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('PostsResolver');

@Resolver('Feed')
export class PostsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createPost')
  @HttpCode(201)
  async create(@Args('createPostInput') createPostInput: CreatePostInput) {
    try {
      const newPost = await lastValueFrom(
        this.postsService.create(createPostInput),
      );
      await this.pubsub.publish('newPost', { newPost: newPost });
      return newPost;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('posts')
  @HttpCode(200)
  async findAll(@Args('page') page?: number, @Args('limit') limit?: number) {
    try {
      return (await lastValueFrom(
        this.postsService.findAll(page, limit),
      )) as Posts;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Query('post')
  @HttpCode(200)
  async findOne(@Args('id') id: string) {
    try {
      return (await lastValueFrom(this.postsService.findOne(id))) as Post;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('updatePost')
  @HttpCode(200)
  async update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    try {
      return (await lastValueFrom(
        this.postsService.update(updatePostInput),
      )) as Post;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('userPosts')
  @HttpCode(200)
  async findUserPosts(
    @Args('userId') userId: string,
    @Args('page') page?: number,
    @Args('limit') limit?: number,
  ) {
    try {
      return (await lastValueFrom(
        this.postsService.findUserPosts(userId, page, limit),
      )) as Posts;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('deletePost')
  @HttpCode(200)
  async remove(@Args('id') id: string, @Args('userId') userId: string) {
    try {
      return (await lastValueFrom(
        this.postsService.remove(id, userId),
      )) as Post;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Subscription('newPost')
  newPost() {
    return this.pubsub.asyncIterator('newPost');
  }
}
