import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesDocument, CategoriesSchema } from './schemas/categories.schema';
import { FileStorageService } from 'src/common/file-storage.service';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { BannerSlotsDocument, BannerSlotsSchema } from '../banners/schemas/slots-banners.controller';
import { SlotSchema, SlotsDocument } from '../games/schemas/games.schema';
import { SlotsBannersModule } from '../banners/banners.module';
import { SlotsGamesModule } from '../games/games.module';
import { SlotsBannersService } from '../banners/banners.service';
import { SlotsGamesService } from '../games/games.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([ 
      { name: CategoriesDocument.name, schema: CategoriesSchema },
    ]), 
    LoggerModule,
    SlotsBannersModule,
    SlotsGamesModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, FileStorageService],
})
export class SlotsCategoriesModule {}
