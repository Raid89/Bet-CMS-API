import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';
import { LogosController } from './logos/logos.controller';
import { LogosService } from './logos/logos.service';
import { PokerController } from './poker/poker.controller';
import { PokerService } from './poker/poker.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeImages, HomeImagesSchema } from './home/home.schema';
import { LoggerModule } from '../logger/logger.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { FileStorageService } from '../../services/file-storage.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature([{ name: HomeImages.name, schema: HomeImagesSchema }]),
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService, FileStorageService]
})
export class AppearanceModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'appearance/home-images/cms/:start/:limit', method: RequestMethod.ALL },
        { path: 'appearance/home-image/:id', method: RequestMethod.ALL },
      );
  }
}