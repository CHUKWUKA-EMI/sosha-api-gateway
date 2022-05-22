import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import {
  CreatereactionInput,
  Reaction,
  Reactions,
  ReactionsPagination,
} from 'src/graphql';

@Injectable()
export class LikesService {
  constructor(
    @Inject('REACTIONS_SERVICE')
    private readonly reactionsServiceClient: ClientProxy,
  ) {}

  create(createReactionInput: CreatereactionInput): Observable<Reaction> {
    const response$ = this.reactionsServiceClient.send<Reaction>(
      { role: 'reaction', cmd: 'create' },
      createReactionInput,
    );

    return response$;
  }

  findPostReactions(
    paginationPayload: ReactionsPagination,
  ): Observable<Reactions> {
    const response$ = this.reactionsServiceClient
      .send<Reactions>(
        { role: 'reaction', cmd: 'findPostReactions' },
        paginationPayload,
      )
      .pipe(timeout(10000));

    return response$;
  }
}
