import { Test, TestingModule } from '@nestjs/testing';
import { FriendResolver } from './friendship.resolver';
import { FriendService } from './friendship.service';

describe('FriendResolver', () => {
  let resolver: FriendResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendResolver, FriendService],
    }).compile();

    resolver = module.get<FriendResolver>(FriendResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
