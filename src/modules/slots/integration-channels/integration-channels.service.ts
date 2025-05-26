import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IntegrationChannel, IntegrationChannelDocument } from '../schemas/integration-channels.schema';
import { CreateIntegrationChannelDto } from '../dto/integration-channel.dto';

@Injectable()
export class IntegrationChannelsService {

  constructor(
    @InjectModel(IntegrationChannel.name)
    private readonly integrationChannelModel: Model<IntegrationChannelDocument>
  ) {}

  async findAll(): Promise<IntegrationChannelDocument[]> {
    try {
      return await this.integrationChannelModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch integration channels');
    }
  }

  async create(createIntegrationChannelDto: CreateIntegrationChannelDto): Promise<IntegrationChannelDocument> {
    try {
      // Check if integration channel already exists
      const existingChannel = await this.integrationChannelModel.findOne({
        integrationChannel: createIntegrationChannelDto.integrationChannel
      });

      if (existingChannel) {
        throw new ConflictException(
          `Integration channel '${createIntegrationChannelDto.integrationChannel}' already exists`
        );
      }

      // Create and save new integration channel
      const newIntegrationChannel = new this.integrationChannelModel(createIntegrationChannelDto);
      return await newIntegrationChannel.save();

    } catch (error: any) {
      // Re-throw known errors
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation error: ${error.message}`);
      }

      // Handle other MongoDB errors
      if (error.code === 11000) {
        throw new ConflictException('Integration channel already exists');
      }

      // Handle unexpected errors
      throw new BadRequestException('Failed to create integration channel');
    }
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    // Validate MongoDB ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Check if document exists before deletion
    const existingDocument = await this.integrationChannelModel.findById(id);
    if (!existingDocument) {
      throw new NotFoundException(`Integration Channel with ID ${id} not found`);
    }

    // Perform deletion
    const result = await this.integrationChannelModel.findByIdAndDelete(id);
    
    return {
      deleted: !!result,
      message: result ? 'Integration Channel deleted successfully' : 'Failed to delete Integration Channel'
    };
  }
}
