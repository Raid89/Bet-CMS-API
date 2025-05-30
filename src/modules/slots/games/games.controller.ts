import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Put, Query, Headers, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Slots - Juegos')
@Controller('slots')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}  @Post('new-slot')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear un nuevo slot/juego' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Slot creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear el slot. Verifique los datos proporcionados.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseInterceptors(AnyFilesInterceptor())
  newSlot(@Body() createGameDto: any, @UploadedFiles() files: any) {
    try {
      console.log('Controller - Received files:', files ? files.length : 0);
      console.log('Controller - Received data keys:', Object.keys(createGameDto));
      
      // Convert files array to object structure similar to req.files
      const filesObject: any = {};
      if (files && files.length > 0) {
        files.forEach((file: any) => {
          console.log(`Processing file: ${file.fieldname}, originalname: ${file.originalname}`);
          
          if (filesObject[file.fieldname]) {
            // Handle multiple files with same fieldname (like msIllustrative[])
            if (!Array.isArray(filesObject[file.fieldname])) {
              filesObject[file.fieldname] = [filesObject[file.fieldname]];
            }
            filesObject[file.fieldname].push(file);
          } else {
            filesObject[file.fieldname] = file;
          }
        });
      }
      
      console.log('Controller - Processed files object keys:', Object.keys(filesObject));
      return this.gamesService.newSlot(createGameDto, filesObject);
    } catch (error: any) {
      console.error('Controller error in newSlot:', error);
      throw error;
    }
  }@Get('get-all/:limit/:skip')
  @ApiOperation({ summary: 'Obtener todos los slots con paginación' })
  @ApiQuery({ name: 'criteria', required: false, description: 'Criterio de búsqueda opcional' })
  getSlots(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Query('criteria') criteria?: string,
    @Headers('iosversion') iosVersion?: string
  ) {
    return this.gamesService.getSlots(limit, skip, criteria, iosVersion);
  }

  @Get('get-sisplay/:limit/:skip')
  @ApiOperation({ summary: 'Obtener slots de Sisplay con paginación' })
  getSlotsSisplay(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Query('criteria') criteria?: string
  ) {
    return this.gamesService.getSlotsSisplay(limit, skip, criteria);
  }

  @Get('get-all-cms/:limit/:skip')
  @ApiOperation({ summary: 'Obtener slots para CMS con paginación' })
  async getSlotsCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Query('criteria') criteria?: string,
    @Query('integrationChannelCode') integrationChannelCode?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.gamesService.getSlotsCMS(limit, skip, criteria, integrationChannelCode, categoryId);
  }

  @Put('set-state/:slotId/:state')
  @ApiOperation({ summary: 'Cambiar el estado de un slot' })
  setSlotState(@Param('slotId') slotId: string, @Param('state') state: string) {
    return this.gamesService.setSlotState(slotId, state);
  }

  @Get('get-single-slot/:id')
  @ApiOperation({ summary: 'Obtener un slot específico por ID' })
  getsingleSlot(@Param('id') id: string) {
    return this.gamesService.getsingleSlot(id);
  }

  @Get('category/:id/all')
  @ApiOperation({ summary: 'Obtener todos los slots de una categoría' })
  getAllSlotsByCategoryId(@Param('id') id: string) {
    return this.gamesService.getAllSlotsByCategoryId(id);
  }
  @Post('update-single-slot/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar un slot específico' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  updateSlot(@Param('id') id: string, @Body() updateData: any, @UploadedFiles() files: any) {
    try {
      console.log('Controller - Updating slot ID:', id);
      console.log('Controller - Received files for update:', files ? files.length : 0);
      console.log('Controller - Update data keys:', Object.keys(updateData));
      
      const filesObject: any = {};
      if (files && files.length > 0) {
        files.forEach((file: any) => {
          console.log(`Processing update file: ${file.fieldname}, originalname: ${file.originalname}`);
          
          if (filesObject[file.fieldname]) {
            if (!Array.isArray(filesObject[file.fieldname])) {
              filesObject[file.fieldname] = [filesObject[file.fieldname]];
            }
            filesObject[file.fieldname].push(file);
          } else {
            filesObject[file.fieldname] = file;
          }
        });
      }
      
      console.log('Controller - Processed update files object keys:', Object.keys(filesObject));
      return this.gamesService.updateSlot(id, updateData, filesObject);
    } catch (error: any) {
      console.error('Controller error in updateSlot:', error);
      throw error;
    }
  }

  @Post('update-single-banner/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar banner de un slot' })
  updateSlotBanner(@Param('id') id: string, @Body() updateData: any) {
    return this.gamesService.updateSlotBanner(id, updateData);
  }

  @Post('update-slot-position/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar posición de un slot' })
  updateSlotPosition(@Param('id') id: string, @Body() updateData: any) {
    return this.gamesService.updateSlotPosition(id, updateData);
  }

  @Post('set-feature-image/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Establecer imagen destacada de un slot' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  setFeatureImage(@Param('id') id: string, @UploadedFiles() files: any, @Req() req: Request) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.gamesService.setFeatureImage(id, { files: filesObject });
  }

  @Post('set-banner/:id?')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Establecer banner' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  setBanner(@Param('id') id: string, @UploadedFiles() files: any, @Req() req: Request) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.gamesService.setBanner(id, { files: filesObject });
  }

  @Get('get-banner')
  @ApiOperation({ summary: 'Obtener banners' })
  getBanner() {
    return this.gamesService.getBanner();
  }

  @Post('remove-slot/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar un slot' })
  deleteSlot(@Param('id') id: string) {
    return this.gamesService.deleteSlot(id);
  }

  @Post('get-games-by-tags')
  @ApiOperation({ summary: 'Obtener juegos por tags' })
  async getGamesByTags(@Body() body: { tags: string[], limit?: number }) {
    const limit = body.limit || 9999;
    return this.gamesService.getGamesByTags(body.tags, limit);
  }

  @Post('new-slots-masive')
  @ApiOperation({ summary: 'Carga masiva de slots' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  slotsMasiveCharge(@UploadedFiles() files: any) {
    return this.gamesService.slotsMasiveCharge(files);
  }

  @Post('delete-slots-masive')
  @ApiOperation({ summary: 'Eliminación masiva de slots' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  deleteSlotMasive(@UploadedFiles() files: any) {
    return this.gamesService.deleteSlotMasive(files);
  }

  // Category endpoints
  @Get('categories/all')
  @ApiOperation({ summary: 'Obtener slots agrupados por categorías' })
  getSlotsByCategory(@Headers('iosversion') iosVersion?: string) {
    return this.gamesService.getSlotsByCategory(iosVersion);
  }

  @Get('categories/sisplay')
  @ApiOperation({ summary: 'Obtener slots de Sisplay agrupados por categorías' })
  getSlotsByCategorySisplay(@Headers('iosversion') iosVersion?: string) {
    return this.gamesService.getSlotsByCategorySisplay(iosVersion);
  }

  @Get('new/categories/sisplay')
  @ApiOperation({ summary: 'Nueva versión de slots de Sisplay agrupados por categorías' })
  newGetSlotsByCategorySisplay() {
    return this.gamesService.newGetSlotsByCategorySisplay();
  }

  @Get('categories/:categoryId/:start/:limit')
  @ApiOperation({ summary: 'Obtener slots por ID de categoría con paginación' })
  getSlotsByCategoryId(
    @Param('categoryId') categoryId: string,
    @Param('start') start: string,
    @Param('limit') limit: string
  ) {
    return this.gamesService.getSlotsByCategoryId(categoryId, start, limit);
  }

  @Get('categories/:categoryId/:start/:limit/sisplay')
  @ApiOperation({ summary: 'Obtener slots por ID de categoría para Sisplay' })
  getSlotsByCategoryIdSisplay(
    @Param('categoryId') categoryId: string,
    @Param('start') start: string,
    @Param('limit') limit: string
  ) {
    return this.gamesService.getSlotsByCategoryIdSisplay(categoryId, start, limit);
  }
}
