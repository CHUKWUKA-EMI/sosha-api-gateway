import { Module } from '@nestjs/common';
import { FriendService } from './friendship.service';
import { FriendResolver } from './friendship.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const FRIENDSHIP_SERVICE = 'FRIENDSHIP_SERVICE';
@Module({
  providers: [
    FriendResolver,
    FriendService,
    {
      provide: FRIENDSHIP_SERVICE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            url: process.env.REDISCLOUD_URL,
          },
        });
      },
    },
  ],
  exports: [FRIENDSHIP_SERVICE],
})
export class FriendModule {}
