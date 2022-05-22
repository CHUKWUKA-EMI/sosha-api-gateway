import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import {
  Chat,
  CreateChatInput,
  UpdateChatInput,
  GetChatsInput,
  SearchChatsInput,
  Chats,
  UserIsTyping,
} from 'src/graphql';

@Injectable()
export class ChatsService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  create(createChatInput: CreateChatInput): Observable<Chat> {
    const response$ = this.chatServiceClient
      .send<Chat>({ role: 'chat', cmd: 'create' }, createChatInput)
      .pipe(timeout(5000));

    return response$;
  }

  getChats(payload: GetChatsInput): Observable<Chats> {
    const response$ = this.chatServiceClient
      .send<Chats>({ role: 'chat', cmd: 'getChats' }, payload)
      .pipe(timeout(5000));

    return response$;
  }

  searchChats(payload: SearchChatsInput): Observable<Chats> {
    const response$ = this.chatServiceClient
      .send<Chats>({ role: 'chat', cmd: 'searchChats' }, payload)
      .pipe(timeout(5000));

    return response$;
  }

  getChat(id: string): Observable<Chat> {
    const response$ = this.chatServiceClient
      .send<Chat>({ role: 'chat', cmd: 'getChat' }, id)
      .pipe(timeout(5000));

    return response$;
  }

  update(updateChatInput: UpdateChatInput): Observable<Chat> {
    const response$ = this.chatServiceClient
      .send<Chat>({ role: 'chat', cmd: 'updateChat' }, updateChatInput)
      .pipe(timeout(5000));

    return response$;
  }

  remove(id: string): Observable<Chat> {
    const response$ = this.chatServiceClient
      .send<Chat>({ role: 'chat', cmd: 'deleteChat' }, id)
      .pipe(timeout(5000));

    return response$;
  }

  userIsTyping(
    friendshipId: number,
    receiverId: string,
    senderFirstName: string,
    senderLastName: string,
  ): Observable<UserIsTyping> {
    const response$ = this.chatServiceClient
      .send<UserIsTyping>(
        { role: 'chat', cmd: 'userIsTyping' },
        { friendshipId, receiverId, senderFirstName, senderLastName },
      )
      .pipe(timeout(5000));

    return response$;
  }
}
