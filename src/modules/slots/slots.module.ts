import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';

// Import controllers
import { IntegrationChannelsController } from './integration-channels/integration-channels.controller';
import { GamesController } from './games/games.controller';
import { BannerController } from './banner/banner.controller';
import { CategoriesController } from './categories/categories.controller';

// Import services
import { IntegrationChannelsService } from './integration-channels/integration-channels.service';
import { GamesService } from './games/games.service';
import { BannerService } from './banner/banner.service';
import { CategoriesService } from './categories/categories.service';

// Import schemas
import { IntegrationChannel, IntegrationChannelSchema } from './schemas/integration-channels.schema';
import { Slot, SlotSchema } from './schemas/slot.schema';
import { Slotimage, SlotimageSchema } from './schemas/slotimage.schema';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from 'src/common/file-storage.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: IntegrationChannel.name, schema: IntegrationChannelSchema },
            { name: Slot.name, schema: SlotSchema },
            { name: Slotimage.name, schema: SlotimageSchema },
            { name: Banner.name, schema: BannerSchema },
            { name: Category.name, schema: CategorySchema },
        ]),
        LoggerModule,
        JwtModule
    ],
    providers: [
        IntegrationChannelsService,
        GamesService,
        BannerService,
        CategoriesService,
        ConfigService,
        FileStorageService,
    ],
    controllers: [
        IntegrationChannelsController,
        GamesController,
        BannerController,
        CategoriesController,
    ],
    exports: [
        IntegrationChannelsService,
        GamesService,
        BannerService,
        CategoriesService,
    ],
})
export class SlotsModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'promotions/categories/:start/:limit', method: RequestMethod.ALL },
      );
  }
}