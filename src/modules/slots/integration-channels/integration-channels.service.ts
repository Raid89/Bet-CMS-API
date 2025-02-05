import { Injectable } from '@nestjs/common';
import { CreateIntegrationChannelDto } from './dto/create-integration-channel.dto';
import { UpdateIntegrationChannelDto } from './dto/update-integration-channel.dto';

@Injectable()
export class IntegrationChannelsService {
  create(createIntegrationChannelDto: CreateIntegrationChannelDto) {
    return 'This action adds a new integrationChannel';
  }

  findAll() {
    return `This action returns all integrationChannels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} integrationChannel`;
  }

  update(id: number, updateIntegrationChannelDto: UpdateIntegrationChannelDto) {
    return `This action updates a #${id} integrationChannel`;
  }

  remove(id: number) {
    return `This action removes a #${id} integrationChannel`;
  }
}
