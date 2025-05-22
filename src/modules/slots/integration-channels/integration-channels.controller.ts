import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { IntegrationChannelsService } from './integration-channels.service';
import { CreateIntegrationChannelDto } from './dto/create-integration-channel.dto';
import { UpdateIntegrationChannelDto } from './dto/update-integration-channel.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseIntegrationalChannelDto } from './dto/response-integrational-channel.dto';
import { IntegrationChannelsDocument } from './schemas/integration-channels.schema';

@ApiTags('Slots - Integration Channels')
@Controller('slots')
export class IntegrationChannelsController {
  constructor(private readonly integrationChannelsService: IntegrationChannelsService) {}

  @Post('create-channel')
  @ApiBody({ type: CreateIntegrationChannelDto })
  @ApiResponse({ status: 200, type: ResponseIntegrationalChannelDto })
  async create(@Body() createIntegrationChannelDto: CreateIntegrationChannelDto): Promise<ResponseIntegrationalChannelDto> {
    return await this.integrationChannelsService.createIntegrationChannel(createIntegrationChannelDto);
  }

  @Get('get-channels')
  @ApiResponse({ status: 200, type: [IntegrationChannelsDocument] })
  findAll(): Promise<IntegrationChannelsDocument[]> {
    return this.integrationChannelsService.IntegrationChannelfindAll();
  }

  @Post('/delete-channel/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ResponseIntegrationalChannelDto })
  async remove(@Param('id') id: string): Promise<ResponseIntegrationalChannelDto> {
    return await this.integrationChannelsService.IntegrationChannelremove(id);
  }
}
