import { PartialType } from '@nestjs/swagger';
import { CreateIntegrationChannelDto } from './create-integration-channel.dto';

export class UpdateIntegrationChannelDto extends PartialType(CreateIntegrationChannelDto) {}
