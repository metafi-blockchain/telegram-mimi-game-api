import { Test, TestingModule } from '@nestjs/testing';
import { NftCategoriesService } from './nft-categories.service';

describe('NftCategoriesService', () => {
  let service: NftCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftCategoriesService],
    }).compile();

    service = module.get<NftCategoriesService>(NftCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
