/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

const logger = new Logger('AuthGuard');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('context', context.getArgByIndex(2));
    const ctx = context.getArgByIndex(2).req;
    try {
      const authHeader: string = ctx.headers.authorization;
      if (!authHeader) {
        return false;
      }
      const authToken = authHeader.split(' ')[1];
      if (!authToken) {
        return false;
      }
      const response$ = this.usersServiceClient.send(
        { role: 'auth', cmd: 'verifyToken' },
        authToken,
      );

      const response = await lastValueFrom(response$);
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}
