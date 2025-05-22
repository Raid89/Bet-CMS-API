import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { FileStorageService } from '../../services/file-storage.service';
import { PromotionCategories, PromoCategoriesSchema } from "./promo-categories/promo-categories.schema";
import { PromoCategoriesController } from "./promo-categories/promo-categories.controller";
import { PromoCategoriesService } from "./promo-categories/promo-categories.service";
import { Promotions, PromotionsSchema } from './promotions/promotions.schema';
import { PromoController } from './promotions/promotions.controller';
import { PromoService } from './promotions/promotions.service';
import { PromoBanners, PromoBannersSchema } from './promo-banners/promo-banners.schema';
import { PromoBannerController } from './promo-banners/promo-banners.controller';
import { PromoBannerService } from './promo-banners/promo-banners.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: PromotionCategories.name, schema: PromoCategoriesSchema},
      { name: Promotions.name, schema: PromotionsSchema},
      { name: PromoBanners.name, schema: PromoBannersSchema},
    ]),
    LoggerModule,
  ],
  controllers: [PromoCategoriesController, PromoController, PromoBannerController],
  providers: [FileStorageService, PromoCategoriesService, PromoService, PromoBannerService],
})
export class PromotionsModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'promotions/categories/:start/:limit', method: RequestMethod.ALL },
        { path: 'promotions/category', method: RequestMethod.ALL },
        { path: 'promotions/category/:categoryId', method: RequestMethod.ALL },
        { path: 'promociones/banners/new-banner', method: RequestMethod.ALL },
        { path: 'promociones/update-single-banner/:id', method: RequestMethod.ALL },
        { path: 'promociones/banners/remove-banner/:id', method: RequestMethod.ALL },
        { path: 'promociones/get-all/:limit/:skip', method: RequestMethod.ALL },
        { path: 'promociones/get-all-filter/:limit/:skip', method: RequestMethod.ALL },
        { path: 'promociones/new-promo', method: RequestMethod.ALL },
        { path: 'promociones/set-feature-image/:id', method: RequestMethod.ALL },
        { path: 'promociones/update-single-promo/:id', method: RequestMethod.ALL },
        { path: 'promociones/remove-promo/:id', method: RequestMethod.ALL },
      );
  }
}