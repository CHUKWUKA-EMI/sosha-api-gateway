import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';
import { ChatsModule } from './chats/chats.module';
import { FriendModule } from './friendship/friendship.module';
import { RepliesModule } from './replies/replies.module';
import { LikesModule } from './likes/likes.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './Posts/posts.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from 'all-http-exceptions-filter';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      debug: true,
      typePaths: ['./**/*.graphql'],
      path: '/graphql',
      subscriptions: {
        'graphql-ws': {
          onConnect: ({ connectionParams }) => {
            const authHeader: any = connectionParams.Authorization;
            if (!authHeader) {
              throw new Error('No auth header');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
              throw new Error('No auth token');
            }

            return connectionParams;
          },
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            const authHeader: any = connectionParams.Authorization;
            if (!authHeader) {
              throw new Error('No auth header');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
              throw new Error('No auth token');
            }

            return connectionParams;
          },
        },
      },
    }),
    UsersModule,
    CommentsModule,
    LikesModule,
    RepliesModule,
    FriendModule,
    ChatsModule,
    PostsModule,
    PubsubModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
