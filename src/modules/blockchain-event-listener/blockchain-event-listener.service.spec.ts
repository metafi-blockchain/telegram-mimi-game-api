import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';

describe('BlockchainEventListenerService', () => {
  let service: BlockchainEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainEventListenerService],
    }).compile();

    service = module.get<BlockchainEventListenerService>(BlockchainEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
