import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { GamesService } from './games.service';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiSecurity } from '@nestjs/swagger';

@ApiTags('Slots - Juegos')
@Controller('slots')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('new-slot')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear un nuevo slot/juego' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Slot creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear el slot. Verifique los datos proporcionados.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createGameDto: any, @UploadedFiles() files: any) {
    // Convert files array to object structure similar to req.files
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
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

    return this.gamesService.create(createGameDto, filesObject);
  }

  // @Get()
  // findAll() {
  //   return this.gamesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gamesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGameDto: any) {
  //   return this.gamesService.update(+id, updateGameDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gamesService.remove(+id);
  // }
}
