import { Test, TestingModule } from '@nestjs/testing';
import { OracleConfigsService } from './oracle-configs.service';

describe('OracleConfigsService', () => {
  let service: OracleConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleConfigsService],
    }).compile();

    service = module.get<OracleConfigsService>(OracleConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
