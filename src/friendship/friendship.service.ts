import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import {
  CreateFollowershipInput,
  FriendShip,
  FriendShips,
  GetFollowersInput,
} from 'src/graphql';

@Injectable()
export class FriendService {
  constructor(
    @Inject('FRIENDSHIP_SERVICE')
    private readonly friendshipServiceClient: ClientProxy,
  ) {}

  follow(
    createFollowershipInput: CreateFollowershipInput,
  ): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient.send<FriendShip>(
      { role: 'friendship', cmd: 'follow' },
      createFollowershipInput,
    );

    return response$;
  }

  followBack(friendshipId: number): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient.send<FriendShip>(
      { role: 'friendship', cmd: 'followBack' },

      friendshipId,
    );

    return response$;
  }

  blacklistFriend(friendshipId: number): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient.send<FriendShip>(
      { role: 'friendship', cmd: 'blacklist' },
      friendshipId,
    );

    return response$;
  }

  whitelistFriend(friendshipId: number): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient.send<FriendShip>(
      { role: 'friendship', cmd: 'whitelist' },
      friendshipId,
    );

    return response$;
  }

  findAllConnections({
    page = 1,
    limit = 20,
    userId,
  }: GetFollowersInput): Observable<FriendShips> {
    const response$ = this.friendshipServiceClient
      .send<FriendShips>(
        { role: 'friendship', cmd: 'findAll' },
        { page, limit, userId },
      )
      .pipe(timeout(10000));

    return response$;
  }

  findOneConnection(friendshipId: number): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient
      .send<FriendShip>({ role: 'friendship', cmd: 'findOne' }, friendshipId)
      .pipe(timeout(10000));

    return response$;
  }

  getFollowersCount(userId: string): Observable<number> {
    const response$ = this.friendshipServiceClient
      .send<number>({ role: 'friendship', cmd: 'getFollowersCount' }, userId)
      .pipe(timeout(10000));

    return response$;
  }

  getFollowingCount(userId: string): Observable<number> {
    const response$ = this.friendshipServiceClient
      .send<number>({ role: 'friendship', cmd: 'getFollowingCount' }, userId)
      .pipe(timeout(10000));

    return response$;
  }

  updateLastMessage(
    friendshipId: number,
    message: string,
  ): Observable<FriendShip> {
    const response$ = this.friendshipServiceClient.send<FriendShip>(
      { role: 'friendship', cmd: 'updateLastMessage' },
      { friendshipId, message },
    );
    return response$;
  }
}
