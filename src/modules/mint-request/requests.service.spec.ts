import { Test, TestingModule } from '@nestjs/testing';
import { MintRequestService } from './requests.service';

describe('MintRequestService', () => {
  let service: MintRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintRequestService],
    }).compile();

    service = module.get<MintRequestService>(MintRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});