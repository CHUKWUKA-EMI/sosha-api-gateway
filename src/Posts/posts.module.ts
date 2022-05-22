import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const POSTS_SERVICE = 'POSTS_SERVICE';

@Module({
  providers: [
    PostsResolver,
    PostsService,
    {
      provide: POSTS_SERVICE,
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
  exports: [POSTS_SERVICE],
})
export class PostsModule {}
