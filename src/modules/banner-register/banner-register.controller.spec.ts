import { Test, TestingModule } from '@nestjs/testing';
import { BannerRegisterController } from './banner-register.controller';

describe('BannerRegisterController', () => {
  let controller: BannerRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannerRegisterController],
    }).compile();

    controller = module.get<BannerRegisterController>(BannerRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
