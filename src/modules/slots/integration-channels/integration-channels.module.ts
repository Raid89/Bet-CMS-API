import { Module } from '@nestjs/common';
import { IntegrationChannelsService } from './integration-channels.service';
import { IntegrationChannelsController } from './integration-channels.controller';

@Module({
  controllers: [IntegrationChannelsController],
  providers: [IntegrationChannelsService],
})
export class IntegrationChannelsModule {}
