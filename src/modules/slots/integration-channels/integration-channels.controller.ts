import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IntegrationChannelsService } from './integration-channels.service';
import { CreateIntegrationChannelDto } from './dto/create-integration-channel.dto';
import { UpdateIntegrationChannelDto } from './dto/update-integration-channel.dto';

@Controller('integration-channels')
export class IntegrationChannelsController {
  constructor(private readonly integrationChannelsService: IntegrationChannelsService) {}

  @Post()
  create(@Body() createIntegrationChannelDto: CreateIntegrationChannelDto) {
    return this.integrationChannelsService.create(createIntegrationChannelDto);
  }

  @Get()
  findAll() {
    return this.integrationChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.integrationChannelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntegrationChannelDto: UpdateIntegrationChannelDto) {
    return this.integrationChannelsService.update(+id, updateIntegrationChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.integrationChannelsService.remove(+id);
  }
}
