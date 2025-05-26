import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { FileStorageService } from '../../common/file-storage.service';
import { PathsController } from './paths/paths.controller';
import { Paths, PathsSchema } from './paths/paths.schema';
import { PathsService } from './paths/paths.service';
import { PointsController } from './points/points.controller';
import { TextsController } from './texts/texts.controller';
import { Points, PointsSchema } from './points/points.schema';
import { Texts, TextsSchema } from './texts/texts.schema';
import { PointsService } from './points/points.service';
import { TextsService } from './texts/texts.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: Paths.name, schema: PathsSchema },
      { name: Points.name, schema: PointsSchema },
      { name: Texts.name, schema: TextsSchema },
    ]),
    LoggerModule,
  ],
  controllers: [PathsController, PointsController, TextsController],
  providers: [FileStorageService, PathsService, PointsService, TextsService],
})
export class ParameterizationModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        
      );
  }
}