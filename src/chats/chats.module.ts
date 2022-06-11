import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

export const CHAT_SERVICE = 'CHAT_SERVICE'
@Module({
  providers: [ChatsResolver, ChatsService,{
    provide: CHAT_SERVICE,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
        },
      });
    },
  },],
  exports:[CHAT_SERVICE]
})
export class ChatsModule {}
