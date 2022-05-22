import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import {
  ClientProxyFactory,
  // ClientsModule,
  Transport,
} from '@nestjs/microservices';

export const USERS_SERVICE = 'USERS_SERVICE';

@Global()
@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: USERS_SERVICE,
    //     transport: Transport.REDIS,
    //     options: {
    //       url: process.env.REDIS_URL,
    //     },
    //   },
    // ]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: USERS_SERVICE,
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
  exports: [USERS_SERVICE],
})
export class UsersModule {}
