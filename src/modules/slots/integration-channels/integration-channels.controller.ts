import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { IntegrationChannelsService } from './integration-channels.service';
import { ApiOperation, ApiSecurity, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateIntegrationChannelDto } from '../dto/integration-channel.dto';

@ApiTags('Slots - Canales de Integración')
@Controller('slots')
export class IntegrationChannelsController {
  constructor(private readonly integrationChannelsService: IntegrationChannelsService) { }

  @Get('get-channels')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Obtener todos los canales de integración' })
  @ApiResponse({ status: 200, description: 'Lista de canales obtenida exitosamente' })
  findAll() {
    return this.integrationChannelsService.findAll();
  }

  @Post('create-channel')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear un nuevo canal de integración' })
  @ApiResponse({ status: 201, description: 'Canal creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El canal ya existe' })
  create(@Body() createIntegrationChannelDto: CreateIntegrationChannelDto) {
    return this.integrationChannelsService.create(createIntegrationChannelDto);
  }

  @Delete('delete-channel/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar un canal de integración por ID' })
  @ApiResponse({ status: 200, description: 'Canal eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Canal no encontrado' })
  remove(@Param('id') id: string) {
    return this.integrationChannelsService.remove(id);
  }
}
