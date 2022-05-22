import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesResolver } from './replies.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const REPLIES_SERVICE = 'REPLIES_SERVICE';
@Module({
  providers: [
    RepliesResolver,
    RepliesService,
    {
      provide: REPLIES_SERVICE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            url: process.env.REDIS_URL,
          },
        });
      },
    },
  ],

  exports: [REPLIES_SERVICE],
})
export class RepliesModule {}
