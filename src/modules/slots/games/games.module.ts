import { Module } from '@nestjs/common';
import { SlotsGamesService } from './games.service';
import { SlotsGamesController } from './games.controller';
import { SlotSchema, SlotsDocument } from './schemas/games.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { SlotsCategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SlotsDocument.name, schema: SlotSchema }]),
    LoggerModule,
  ],
  controllers: [SlotsGamesController],
  providers: [SlotsGamesService],
  exports: [SlotsGamesService],
})
export class SlotsGamesModule {}