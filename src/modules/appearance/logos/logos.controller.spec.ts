import { Test, TestingModule } from '@nestjs/testing';
import { LogosController } from './logos.controller';

describe('LogosController', () => {
  let controller: LogosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogosController],
    }).compile();

    controller = module.get<LogosController>(LogosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
