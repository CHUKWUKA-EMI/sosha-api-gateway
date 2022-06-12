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

  logout(userId: string): Observable<string> {
    const response$ = this.usersServiceClient
      .send<string>({ role: 'users', cmd: 'logout' }, userId)
      .pipe(timeout(5000));

    return response$;
  }

  requestPasswordReset(email: string): Observable<string> {
    const res$ = this.usersServiceClient
      .send<string>({ role: 'users', cmd: 'requestPasswordReset' }, email)
      .pipe(timeout(5000));
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
    const users$ = this.usersServiceClient
      .send<Users>({ role: 'users', cmd: 'getAllUsers' }, { page, limit })
      .pipe(timeout(5000));
    return users$;
  }

  findOne(id: string): Observable<User> {
    const user$ = this.usersServiceClient
      .send<User>({ role: 'users', cmd: 'findOne' }, id)
      .pipe(timeout(5000));

    return user$;
  }

  findByUserName(username: string, token?: string): Observable<User> {
    const user$ = this.usersServiceClient
      .send<User>(
        { role: 'users', cmd: 'getUserByUserName' },
        { username, token },
      )
      .pipe(timeout(5000));

    return user$;
  }

  retrieveUser(payload: RetrieveUserPayload): Observable<User> {
    const user$ = this.usersServiceClient
      .send<User>({ role: 'users', cmd: 'retrieveUser' }, payload)
      .pipe(timeout(5000));

    return user$;
  }

  update(updateUserInput: UpdateUserInput): Observable<User> {
    const user$ = this.usersServiceClient
      .send<User>({ role: 'users', cmd: 'updateProfile' }, updateUserInput)
      .pipe(timeout(5000));

    return user$;
  }

  remove(id: string): Observable<User> {
    const user$ = this.usersServiceClient
      .send<User>({ role: 'users', cmd: 'removeUser' }, id)
      .pipe(timeout(5000));

    return user$;
  }
}
