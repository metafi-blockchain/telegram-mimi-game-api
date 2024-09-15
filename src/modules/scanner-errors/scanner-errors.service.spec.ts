import { Test, TestingModule } from '@nestjs/testing';
import { ScannerErrorsService } from './scanner-errors.service';

describe('ScannerErrorsService', () => {
  let service: ScannerErrorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScannerErrorsService],
    }).compile();

    service = module.get<ScannerErrorsService>(ScannerErrorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
