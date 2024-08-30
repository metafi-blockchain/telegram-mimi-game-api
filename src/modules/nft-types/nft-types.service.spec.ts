import { Test, TestingModule } from '@nestjs/testing';
import { NftTypesService } from './nft-types.service';

describe('NftTypesService', () => {
  let service: NftTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftTypesService],
    }).compile();

    service = module.get<NftTypesService>(NftTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
