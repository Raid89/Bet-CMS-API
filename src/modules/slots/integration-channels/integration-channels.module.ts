import { Module } from '@nestjs/common';
import { IntegrationChannelsService } from './integration-channels.service';
import { IntegrationChannelsController } from './integration-channels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationChannelsDocument, IntegrationChannelsSchema } from './schemas/integration-channels.schema';
import { LoggerModule } from 'src/modules/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: IntegrationChannelsDocument.name, schema: IntegrationChannelsSchema } ]),
    LoggerModule
  ],
  controllers: [IntegrationChannelsController],
  providers: [IntegrationChannelsService],
})
export class IntegrationChannelsModule {}
