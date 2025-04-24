import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
  } from '@nestjs/common';
  import { TextsService } from './texts.service';
  import { CreateTextDto, UpdateTextDto } from './dto/texts.dto';
  import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Parametrización - Textos')
  @Controller('parameterize/text')
  export class TextsController {
    constructor(private textsService: TextsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Obtener JSON parametrizado' })
    @ApiResponse({ status: 200, description: 'JSON retornado exitosamente' })
    @HttpCode(HttpStatus.OK)
    async getJSON() {
      return await this.textsService.getJSON();
    }
  
    @Post('init')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Inicializar JSON de textos' })
    @ApiResponse({ status: 201, description: 'JSON inicializado exitosamente' })
    @HttpCode(HttpStatus.CREATED)
    async initJSON() {
      return await this.textsService.initJSON();
    }
  
    @Post(':id')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Actualizar JSON parametrizado por ID' })
    @ApiResponse({ status: 201, description: 'JSON actualizado exitosamente' })
    @HttpCode(HttpStatus.CREATED)
    async updateJSON(@Param('id') id: string, @Body() body: UpdateTextDto) {
      return await this.textsService.updateJSON(id, body);
    }
  }
  