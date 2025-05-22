import { Module } from '@nestjs/common';
import { SlotsCategoriesModule } from './categories/categories.module';
import { SlotsGamesModule } from './games/games.module';
import { IntegrationChannelsModule } from './integration-channels/integration-channels.module';
import { SlotsBannersModule } from './banners/banners.module';
import { MicrositesModule } from './microsites/microsites.module';
import { JackpotModule } from './jackpot/jackpot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SlotsCategoriesModule, 
    SlotsGamesModule, 
    IntegrationChannelsModule, 
    SlotsBannersModule, 
    MicrositesModule, 
    JackpotModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ]
})
export class SlotsModule {}
