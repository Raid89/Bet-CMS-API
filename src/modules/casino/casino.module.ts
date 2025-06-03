import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CasinoGamesController } from './games/casino-games.controller';
import { CasinoGamesService } from './games/casino-games.service';
import { CasinoVipGamesController } from './vip-games/casino-vip-games.controller';
import { CasinoVipGamesService } from './vip-games/casino-vip-games.service';
import { CasinoLive, CasinoLiveSchema } from './schemas/casino-live.schema';
import { BannerCL, BannerCLSchema } from './schemas/banner-cl.schema';
import { ClCategory, ClCategorySchema } from './schemas/cl-category.schema';
import { CLIntegrationChannelCodes, CLIntegrationChannelCodesSchema } from './schemas/cl-integration-channel-codes.schema';
import { CasinoLiveVip, CasinoLiveVipSchema } from './schemas/casino-live-vip.schema';
import { BannerClVip, BannerClVipSchema } from './schemas/banner-cl-vip.schema';
import { ClCategoryVip, ClCategoryVipSchema } from './schemas/cl-category-vip.schema';
import { ClIntegrationChannelCodesVip, ClIntegrationChannelCodesVipSchema } from './schemas/cl-integration-channel-codes-vip.schema';
import { FileStorageService } from '../../common/file-storage.service';

@Module({
  imports: [
    ConfigModule, // Importar ConfigModule para que ConfigService esté disponible
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),    MongooseModule.forFeature([
      { name: CasinoLive.name, schema: CasinoLiveSchema },
      { name: BannerCL.name, schema: BannerCLSchema },
      { name: ClCategory.name, schema: ClCategorySchema },
      { name: CLIntegrationChannelCodes.name, schema: CLIntegrationChannelCodesSchema },
      { name: CasinoLiveVip.name, schema: CasinoLiveVipSchema },
      { name: BannerClVip.name, schema: BannerClVipSchema },
      { name: ClCategoryVip.name, schema: ClCategoryVipSchema },
      { name: ClIntegrationChannelCodesVip.name, schema: ClIntegrationChannelCodesVipSchema }
    ])
  ],  controllers: [CasinoGamesController, CasinoVipGamesController],
  providers: [CasinoGamesService, CasinoVipGamesService, FileStorageService],
  exports: [CasinoGamesService, CasinoVipGamesService]
})
export class CasinoModule {}