import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { GamesModule } from './games/games.module';
import { IntegrationChannelsModule } from './integration-channels/integration-channels.module';
import { BannersModule } from './banners/banners.module';
import { MicrositesModule } from './microsites/microsites.module';
import { JackpotModule } from './jackpot/jackpot.module';

@Module({
  imports: [CategoriesModule, GamesModule, IntegrationChannelsModule, BannersModule, MicrositesModule, JackpotModule]
})
export class SlotsModule {}
