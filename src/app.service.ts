import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
  ) {}
  async verifyEmail(token: string): Promise<boolean> {
    const response$ = this.usersServiceClient
      .send<boolean>({ role: 'users', cmd: 'verifyEmail' }, token)
      .pipe(timeout(10000));
    return await lastValueFrom(response$);
  }

  async testEndpoint(token: string): Promise<boolean> {
    const response$ = this.usersServiceClient
      .send<boolean>({ role: 'users', cmd: 'verifyEmail' }, token)
      .pipe(timeout(10000));
    return await lastValueFrom(response$);
  }
}
