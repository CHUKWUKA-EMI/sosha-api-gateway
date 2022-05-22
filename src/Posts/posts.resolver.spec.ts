import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

describe('FeedsResolver', () => {
  let resolver: PostsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsResolver, PostsService],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
