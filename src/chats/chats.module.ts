import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDISCLOUD_URL,
        },
      },
    ]),
  ],
  providers: [ChatsResolver, ChatsService],
})
export class ChatsModule {}
