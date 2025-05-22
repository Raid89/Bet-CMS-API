import { Module } from '@nestjs/common';
import { SlotsBannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerSlotsDocument, BannerSlotsSchema } from './schemas/slots-banners.controller';
import { LoggerModule } from 'src/modules/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BannerSlotsDocument.name, schema: BannerSlotsSchema}]),
    LoggerModule,
  ],
  controllers: [BannersController],
  providers: [SlotsBannersService],
  exports: [SlotsBannersService],
})
export class SlotsBannersModule {}
