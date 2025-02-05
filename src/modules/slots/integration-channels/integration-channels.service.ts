import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIntegrationChannelDto } from './dto/create-integration-channel.dto';
import { UpdateIntegrationChannelDto } from './dto/update-integration-channel.dto';
import { IntegrationChannelsDocument } from './schemas/integration-channels.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isMongoId } from 'class-validator';
import { ResponseIntegrationalChannelDto } from './dto/response-integrational-channel.dto';

@Injectable()
export class IntegrationChannelsService {

  constructor(
    @InjectModel(IntegrationChannelsDocument.name)
    private integrationChannelModel: Model<IntegrationChannelsDocument>,
  ) {
    
  }

  async create(createIntegrationChannelDto: CreateIntegrationChannelDto): Promise<ResponseIntegrationalChannelDto> {
    const newIntegrationalChannel = await this.integrationChannelModel.create(createIntegrationChannelDto);
    return {
      _id: newIntegrationalChannel._id as string,
      message: 'Channel creado con Extito!',
      code: "100"
    }
  }

  async findAll(): Promise<IntegrationChannelsDocument[]> {
    const allChannels = await this.integrationChannelModel.find().sort({ integrationChannel: 1 });
    return allChannels;
  }


  async remove(id: string): Promise<ResponseIntegrationalChannelDto> {
    const idIsMongoId = isMongoId(id);
    if (!idIsMongoId) throw new BadRequestException('Invalid ID');

    const channelDeleted = await this.integrationChannelModel.deleteOne({ _id: id });
    if (channelDeleted.deletedCount === 0) return { code: "404", message: "Recurso no encontrado" };

    return { code: "100", message: "Recurso eliminado" };
  }
}
