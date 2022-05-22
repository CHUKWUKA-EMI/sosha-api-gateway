import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const COMMENTS_SERVICE = 'COMMENTS_SERVICE';

@Module({
  providers: [
    CommentsResolver,
    CommentsService,
    {
      provide: COMMENTS_SERVICE,
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
  exports: [COMMENTS_SERVICE],
})
export class CommentsModule {}
