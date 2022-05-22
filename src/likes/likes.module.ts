import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const REACTIONS_SERVICE = 'REACTIONS_SERVICE';

@Module({
  providers: [
    LikesResolver,
    LikesService,
    {
      provide: REACTIONS_SERVICE,
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
  exports: [REACTIONS_SERVICE],
})
export class LikesModule {}
