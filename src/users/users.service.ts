import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, timeout } from 'rxjs';
import {
  AuthData,
  CreateUserInput,
  RetrieveUserPayload,
  PasswordChange,
  UpdateUserInput,
  User,
  Users,
} from 'src/graphql';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
  ) {}

  create(createUserInput: CreateUserInput): Observable<User> {
    const response$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'create' },
      createUserInput,
    );
    return response$;
  }

  login(email: string, password: string): Observable<AuthData> {
    const response$ = this.usersServiceClient.send<AuthData>(
      { role: 'users', cmd: 'login' },
      { email, password },
    );

    return response$;
  }

  logout(userId: string, refreshToken: string): Observable<string> {
    const response$ = this.usersServiceClient.send<string>(
      { role: 'users', cmd: 'logout' },
      { userId, refreshToken },
    );

    return response$;
  }

  requestPasswordReset(email: string): Observable<string> {
    const res$ = this.usersServiceClient.send<string>(
      { role: 'users', cmd: 'requestPasswordReset' },
      email,
    );

    return res$;
  }

  resetPassword(email: string): Observable<string> {
    const res$ = this.usersServiceClient.send<string>(
      { role: 'users', cmd: 'resetPassword' },
      { email },
    );
    return res$;
  }

  changePassword(payload: PasswordChange): Observable<any> {
    const res$ = this.usersServiceClient.send<any>(
      { role: 'users', cmd: 'changePassword' },
      payload,
    );
    return res$;
  }

  findAll(page: number, limit: number): Observable<Users> {
    const users$ = this.usersServiceClient.send<Users>(
      { role: 'users', cmd: 'getAllUsers' },
      { page, limit },
    );

    return users$;
  }

  findOne(id: string): Observable<User> {
    const user$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'findOne' },
      id,
    );

    return user$;
  }

  findByUserName(username: string, token?: string): Observable<User> {
    const user$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'getUserByUserName' },
      { username, token },
    );

    return user$;
  }

  retrieveUser(payload: RetrieveUserPayload): Observable<User> {
    const user$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'retrieveUser' },
      payload,
    );

    return user$;
  }

  update(updateUserInput: UpdateUserInput): Observable<User> {
    const user$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'updateProfile' },
      updateUserInput,
    );

    return user$;
  }

  remove(id: string): Observable<User> {
    const user$ = this.usersServiceClient.send<User>(
      { role: 'users', cmd: 'removeUser' },
      id,
    );

    return user$;
  }
}
