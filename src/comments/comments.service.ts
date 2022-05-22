import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import {
  Comment,
  Comments,
  CreateCommentInput,
  UpdateCommentInput,
} from 'src/graphql';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_SERVICE')
    private readonly commentsServiceClient: ClientProxy,
  ) {}

  create(createCommentInput: CreateCommentInput): Observable<Comment> {
    const response$ = this.commentsServiceClient.send<Comment>(
      { role: 'comments', cmd: 'create' },
      createCommentInput,
    );

    return response$;
  }

  findAll(postId: string, page?: number, limit?: number): Observable<Comments> {
    const response$ = this.commentsServiceClient
      .send<Comments>(
        { role: 'comments', cmd: 'findAll' },
        { postId, page, limit },
      )
      .pipe(timeout(10000));
    return response$;
  }

  findOne(id: string): Observable<Comment> {
    const response$ = this.commentsServiceClient
      .send<Comment>({ role: 'comments', cmd: 'findOne' }, id)
      .pipe(timeout(10000));

    return response$;
  }

  findByUser(
    userId: string,
    page?: number,
    limit?: number,
  ): Observable<Comments> {
    const response$ = this.commentsServiceClient
      .send<Comments>(
        { role: 'comments', cmd: 'findByUser' },
        { userId, page, limit },
      )
      .pipe(timeout(10000));

    return response$;
  }

  update(updateCommentInput: UpdateCommentInput): Observable<Comment> {
    const response$ = this.commentsServiceClient.send<Comment>(
      { role: 'comments', cmd: 'update' },
      updateCommentInput,
    );

    return response$;
  }

  remove(id: string, userId: string): Observable<Comment> {
    const response$ = this.commentsServiceClient.send<Comment>(
      { role: 'comments', cmd: 'delete' },
      { id, userId },
    );

    return response$;
  }
}
