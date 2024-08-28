import { Test, TestingModule } from '@nestjs/testing';
import { ActivitylogsService } from './activitylogs.service';

describe('ActivitylogsService', () => {
  let service: ActivitylogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitylogsService],
    }).compile();

    service = module.get<ActivitylogsService>(ActivitylogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
