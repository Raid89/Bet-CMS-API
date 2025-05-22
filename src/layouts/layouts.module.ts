import { Module } from '@nestjs/common';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageDocument, ImageSchema } from './images/schemas/images.schema';
import { BannerESportsDocument, BannerESportsSchema } from './esports/schemas/banner-esports.schema';
import { LayoutsDocument, LayoutsSchema } from './home/schemas/layouts.schema';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { FileStorageService } from 'src/common/file-storage.service';
import { LayoutController } from './home/layout.controller';
import { LayoutService } from './home/layout.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageDocument.name, schema: ImageSchema },
      { name: BannerESportsDocument.name, schema: BannerESportsSchema },
      { name: LayoutsDocument.name, schema: LayoutsSchema }
    ]),
    LoggerModule
  ],
  controllers: [ImagesController, LayoutController],
  providers: [ImagesService, LayoutService, FileStorageService],
})
export class LayoutsModule {}
