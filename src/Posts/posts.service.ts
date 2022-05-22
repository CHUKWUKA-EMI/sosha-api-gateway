import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import { CreatePostInput, Post, Posts, UpdatePostInput } from 'src/graphql';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_SERVICE') private readonly postsServiceClient: ClientProxy,
  ) {}

  create(createPostInput: CreatePostInput): Observable<Post> {
    const response$ = this.postsServiceClient.send<Post>(
      { role: 'posts', cmd: 'create' },
      createPostInput,
    );

    return response$;
  }

  findAll(page?: number, limit?: number): Observable<Posts> {
    const response$ = this.postsServiceClient
      .send<Posts>({ role: 'posts', cmd: 'findAll' }, { page, limit })
      .pipe(timeout(10000));

    return response$;
  }

  findOne(id: string): Observable<Post> {
    const response$ = this.postsServiceClient
      .send<Post>({ role: 'posts', cmd: 'findOne' }, id)
      .pipe(timeout(10000));

    return response$;
  }

  findUserPosts(
    userId: string,
    page?: number,
    limit?: number,
  ): Observable<Posts> {
    const response$ = this.postsServiceClient
      .send<Posts>(
        { role: 'posts', cmd: 'findUserPosts' },
        { userId, page, limit },
      )
      .pipe(timeout(10000));

    return response$;
  }

  update(updatePostInput: UpdatePostInput): Observable<Post> {
    const response$ = this.postsServiceClient.send<Post>(
      { role: 'posts', cmd: 'update' },
      updatePostInput,
    );
    return response$;
  }

  remove(id: string, userId: string): Observable<Post> {
    const response$ = this.postsServiceClient.send<Post>(
      { role: 'posts', cmd: 'delete' },
      { id, userId },
    );

    return response$;
  }
}
