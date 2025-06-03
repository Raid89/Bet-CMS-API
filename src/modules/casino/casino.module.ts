import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CasinoGamesController } from './games/casino-games.controller';
import { CasinoGamesService } from './games/casino-games.service';
import { CasinoLive, CasinoLiveSchema } from './schemas/casino-live.schema';
import { BannerCL, BannerCLSchema } from './schemas/banner-cl.schema';
import { ClCategory, ClCategorySchema } from './schemas/cl-category.schema';
import { CLIntegrationChannelCodes, CLIntegrationChannelCodesSchema } from './schemas/cl-integration-channel-codes.schema';
import { FileStorageService } from '../../common/file-storage.service';

@Module({
  imports: [
    ConfigModule, // Importar ConfigModule para que ConfigService esté disponible
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: CasinoLive.name, schema: CasinoLiveSchema },
      { name: BannerCL.name, schema: BannerCLSchema },
      { name: ClCategory.name, schema: ClCategorySchema },
      { name: CLIntegrationChannelCodes.name, schema: CLIntegrationChannelCodesSchema }
    ])
  ],
  controllers: [CasinoGamesController],
  providers: [CasinoGamesService, FileStorageService],
  exports: [CasinoGamesService]
})
export class CasinoModule {}