import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CasinoGamesService } from './casino-games.service';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@ApiTags('Casino Live Games')
@Controller('casino/games')
export class CasinoGamesController {
  constructor(private readonly casinoGamesService: CasinoGamesService) {}
  
  @Post('create')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo juego de casino live' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async createGame(
    @Body() createGameDto: CreateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.casinoGamesService.createGame(createGameDto, filesObject);
  }

  @Put('update/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un juego de casino live' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updateGame(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.casinoGamesService.updateGame(id, updateGameDto, filesObject);
  }

  @Delete('delete/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un juego de casino live' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live' })
  async deleteGame(@Param('id') id: string) {
    return this.casinoGamesService.deleteGame(id);
  }
  @Get('cms/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos de casino live para CMS con paginación' })
  @ApiParam({ name: 'limit', description: 'Número de elementos por página' })
  @ApiParam({ name: 'skip', description: 'Número de elementos a omitir' })
  async getGamesCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    return this.casinoGamesService.getGamesCMS(limitNum, skipNum);
  }
  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los juegos de casino live activos' })
  async getActiveGames() {
    return this.casinoGamesService.getActiveGames();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un juego de casino live por ID' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live' })
  async getGameById(@Param('id') id: string) {
    return this.casinoGamesService.getGameById(id);
  }

  @Post('set-image/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Establecer imagen de un juego de casino live' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  setImage(@Param('id') id: string, @UploadedFiles() files: any, @Req() req: Request) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.casinoGamesService.setImage(id, { files: filesObject });
  }

  @Post('set-icon/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Establecer icono de un juego de casino live' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  setIcon(@Param('id') id: string, @UploadedFiles() files: any, @Req() req: Request) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.casinoGamesService.setIcon(id, { files: filesObject });
  }
}
