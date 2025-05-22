import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIntegrationChannelDto } from './dto/create-integration-channel.dto';
import { UpdateIntegrationChannelDto } from './dto/update-integration-channel.dto';
import { IntegrationChannelsDocument } from './schemas/integration-channels.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isMongoId } from 'class-validator';
import { ResponseIntegrationalChannelDto } from './dto/response-integrational-channel.dto';
import { NextLoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class IntegrationChannelsService {

  constructor(
    @InjectModel(IntegrationChannelsDocument.name)
    private readonly integrationChannelModel: Model<IntegrationChannelsDocument>,
    private readonly logger: NextLoggerService
  ) {
    
  }

  async createIntegrationChannel(createIntegrationChannelDto: CreateIntegrationChannelDto): Promise<ResponseIntegrationalChannelDto> {
    this.logger.log('Creando canal de integracion', 'createIntegrationChannel', JSON.stringify(createIntegrationChannelDto));
    try {
      const newIntegrationalChannel = await this.integrationChannelModel.create(createIntegrationChannelDto);
      return {
        _id: newIntegrationalChannel._id as string,
        message: 'Channel creado con Extito!',
        code: "100"
      }      
    } catch (error) {
      this.logger.error('Ha ocurrido un error al crear el canal de integracion', 'createIntegrationChannel', JSON.stringify(error));
      throw error;
    }
  }

  async IntegrationChannelfindAll(): Promise<IntegrationChannelsDocument[]> {
    this.logger.log('Buscando todos los canales de integracion', 'IntegrationChannelfindAll');
    try {
      const allChannels = await this.integrationChannelModel.find().sort({ integrationChannel: 1 });
      return allChannels;
    } catch (error) {
      this.logger.error('Ha ocurrido un error al buscar todos los canales de integracion', 'IntegrationChannelfindAll', JSON.stringify(error));
      throw error;
    }
  }

  async IntegrationChannelremove(id: string): Promise<ResponseIntegrationalChannelDto> {
    this.logger.log('Eliminando canal de integracion', 'IntegrationChannelremove', id);
    const idIsMongoId = isMongoId(id);
    if (!idIsMongoId) {
      this.logger.error('ID invalido', 'IntegrationChannelremove', id);
      throw new BadRequestException('Invalid ID');
    }

    try {
      const channelDeleted = await this.integrationChannelModel.deleteOne({ _id: id });
      if (channelDeleted.deletedCount === 0) {
        this.logger.error('Recurso no encontrado', 'IntegrationChannelremove', id);
        return { code: "404", message: "Recurso no encontrado" };
      }

      this.logger.log('Recurso eliminado con exito', 'IntegrationChannelremove', id);
      return { code: "100", message: "Recurso eliminado" };
    } catch (error) {
      this.logger.error('Ha ocurrido un error al eliminar el canal de integracion', 'IntegrationChannelremove', JSON.stringify(error));
      throw error;
    }
  }
}
