import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CasinoLiveService } from '../src/modules/casino/games/casino-live.service';
import { CasinoLive } from '../src/modules/casino/schemas/casino-live.schema';
import { FileStorageService } from '../src/common/file-storage.service';
import { ConfigService } from '@nestjs/config';

describe('CasinoLiveService', () => {
  let service: CasinoLiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasinoLiveService,
        FileStorageService,
        ConfigService,
        {
          provide: getModelToken(CasinoLive.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CasinoLiveService>(CasinoLiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
