import { Test, TestingModule } from '@nestjs/testing';
import { MintRequestController } from './requests.controller';

describe('RequestController', () => {
  let controller: MintRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MintRequestController],
    }).compile();

    controller = module.get<MintRequestController>(MintRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
