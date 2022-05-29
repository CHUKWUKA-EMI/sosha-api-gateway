import { Inject, HttpCode, Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from 'src/users/auth.guard';
import {
  CreateFollowershipInput,
  FriendShip,
  FriendShips,
  GetFollowersInput,
} from 'src/graphql';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { FriendService } from './friendship.service';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('FriendShipResolver');

@Resolver('Friend')
export class FriendResolver {
  constructor(
    @Inject(PUB_SUB) private readonly punsub: RedisPubSub,
    private readonly friendService: FriendService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('follow')
  @HttpCode(201)
  async follow(
    @Args('createFollowershipInput')
    createFollowershipInput: CreateFollowershipInput,
  ) {
    try {
      const newFollower = (await lastValueFrom(
        this.friendService.follow(createFollowershipInput),
      )) as FriendShip;
      this.punsub.publish('newFollower', { newFollower });
      return newFollower;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('followBack')
  @HttpCode(200)
  async followBack(
    @Args('friendshipId')
    friendshipId: number,
  ) {
    try {
      return (await lastValueFrom(
        this.friendService.followBack(friendshipId),
      )) as FriendShip;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('updateLastMessage')
  @HttpCode(200)
  async updateLastMessage(
    @Args('friendshipId')
    friendshipId: number,
    @Args('message') message: string,
  ) {
    try {
      const lastMessage = (await lastValueFrom(
        this.friendService.updateLastMessage(friendshipId, message),
      )) as FriendShip;
      this.punsub.publish('lastMessage', { lastMessage });
      return lastMessage;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('myConnections')
  @HttpCode(200)
  async findAll(@Args('payload') payload: GetFollowersInput) {
    try {
      return (await lastValueFrom(
        this.friendService.findAllConnections(payload),
      )) as FriendShips;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('connection')
  @HttpCode(200)
  async findOne(@Args('friendshipId') friendshipId: number) {
    try {
      return (await lastValueFrom(
        this.friendService.findOneConnection(friendshipId),
      )) as FriendShip;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('followersCount')
  @HttpCode(200)
  async followersCount(@Args('userId') userId: string) {
    try {
      return (await lastValueFrom(
        this.friendService.getFollowersCount(userId),
      )) as number;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Query('followingCount')
  @HttpCode(200)
  async followingCount(@Args('userId') userId: string) {
    try {
      return (await lastValueFrom(
        this.friendService.getFollowingCount(userId),
      )) as number;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('blacklistFriend')
  @HttpCode(200)
  async blacklistFriend(@Args('friendshipId') friendshipId: number) {
    try {
      return (await lastValueFrom(
        this.friendService.blacklistFriend(friendshipId),
      )) as FriendShip;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation('whitelistFriend')
  @HttpCode(200)
  async whitelistFriend(@Args('friendshipId') friendshipId: number) {
    try {
      return (await lastValueFrom(
        this.friendService.whitelistFriend(friendshipId),
      )) as FriendShip;
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @Subscription('newFollower', {
    filter: (payload, variables) => {
      return payload.newFollower.friendId === variables.friendId;
    },
  })
  newFollower(@Args('friendId') friendId: string) {
    logger.log(
      `${friendId} successfully subscribed to followership notification`,
    );
    return this.punsub.asyncIterator('newFollower');
  }

  @Subscription('lastMessage', {
    filter: (payload, variables) => {
      return payload.lastMessage.id === variables.friendshipId;
    },
  })
  lastMessage(@Args('friendshipId') friendshipId: number) {
    logger.log(
      `${friendshipId} successfully subscribed to last message notification`,
    );
    return this.punsub.asyncIterator('lastMessage');
  }
}
