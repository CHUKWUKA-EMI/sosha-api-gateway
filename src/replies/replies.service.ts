import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateReplyInput,
  GetRepliesInput,
  Replies,
  Reply,
  UpdateReplyInput,
} from 'src/graphql';

@Injectable()
export class RepliesService {
  constructor(
    @Inject('REPLIES_SERVICE')
    private readonly repliesServiceClient: ClientProxy,
  ) {}

  create(createReplyInput: CreateReplyInput): Observable<Reply> {
    const response$ = this.repliesServiceClient.send<Reply>(
      { role: 'replies', cmd: 'create' },
      createReplyInput,
    );

    return response$;
  }

  findAll(payload: GetRepliesInput): Observable<Replies> {
    const response$ = this.repliesServiceClient.send<Replies>(
      { role: 'replies', cmd: 'findAll' },
      payload,
    );

    return response$;
  }

  findOne(id: string): Observable<Reply> {
    const response$ = this.repliesServiceClient.send<Reply>(
      { role: 'replies', cmd: 'findOne' },
      id,
    );

    return response$;
  }

  update(updateReplyInput: UpdateReplyInput): Observable<Reply> {
    const response$ = this.repliesServiceClient.send<Reply>(
      { role: 'replies', cmd: 'update' },
      updateReplyInput,
    );

    return response$;
  }

  remove(id: string, userId: string): Observable<Reply> {
    const response$ = this.repliesServiceClient.send<Reply>(
      { role: 'relpies', cmd: 'delete' },
      { id, userId },
    );

    return response$;
  }
}
