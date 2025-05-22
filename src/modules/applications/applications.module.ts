import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Applications, ApplicationsSchema } from './applications.schema';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import { FileStorageService } from '../../common/file-storage.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Applications.name, schema: ApplicationsSchema}])
  ],	
  providers: [ApplicationsService, FileStorageService],
  controllers: [ApplicationsController]
})
export class ApplicationsModule {}
