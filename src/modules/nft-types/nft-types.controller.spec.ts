import { Test, TestingModule } from '@nestjs/testing';
import { NftTypesController } from './nft-types.controller';

describe('NftTypesController', () => {
  let controller: NftTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftTypesController],
    }).compile();

    controller = module.get<NftTypesController>(NftTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
