import { Test, TestingModule } from '@nestjs/testing';
import { WeeklyFriendService } from './weekly-friend.service';

describe('WeeklyFriendService', () => {
  let service: WeeklyFriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeeklyFriendService],
    }).compile();

    service = module.get<WeeklyFriendService>(WeeklyFriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
