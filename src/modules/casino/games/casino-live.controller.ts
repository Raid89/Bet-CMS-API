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
import { CasinoLiveService } from './casino-live.service';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@ApiTags('Casino Live ND')
@Controller('clnd')
export class CasinoLiveController {
  constructor(private readonly casinoLiveService: CasinoLiveService) {}
  
  @Post('new-game')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo juego de casino live ND' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async newGame(
    @Body() createGameDto: CreateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    console.log('Controller newGame - Body:', createGameDto);
    console.log('Controller newGame - Files:', files);
    
    const result = await this.casinoLiveService.newGame(createGameDto, files);
    
    return {
      createdGame: result
    };
  }

  @Put('update-game/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un juego de casino live ND' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live ND' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updateGame(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    console.log('Controller updateGame - ID:', id);
    console.log('Controller updateGame - Body:', updateGameDto);
    console.log('Controller updateGame - Files:', files);
    
    const result = await this.casinoLiveService.updateGame(id, updateGameDto, files);
    
    return {
      updatedGame: result
    };
  }

  @Delete('delete-game/:id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un juego de casino live ND' })
  @ApiParam({ name: 'id', description: 'ID del juego de casino live ND' })
  async deleteGame(@Param('id') id: string) {
    console.log('Controller deleteGame - ID:', id);
    
    const result = await this.casinoLiveService.deleteGame(id);
    
    return {
      deleted: result
    };
  }

  @Get('get-cms/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos de casino live ND para CMS con paginación' })
  @ApiParam({ name: 'limit', description: 'Número de elementos por página' })
  @ApiParam({ name: 'skip', description: 'Número de elementos a omitir' })
  async getGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    
    console.log('Controller getGamesCLCMS - Limit:', limitNum, 'Skip:', skipNum);
    
    const result = await this.casinoLiveService.getGamesCLCMS(limitNum, skipNum);
    
    return {
      games: result.games,
      total: result.total,
      base_url: result.base_url
    };
  }

  @Get('get-cms-filter/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos filtrados de casino live ND para CMS' })
  @ApiParam({ name: 'limit', description: 'Número de elementos por página' })
  @ApiParam({ name: 'skip', description: 'Número de elementos a omitir' })
  async getFilterGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    
    console.log('Controller getFilterGamesCLCMS - Limit:', limitNum, 'Skip:', skipNum);
    
    const result = await this.casinoLiveService.getFilterGamesCLCMS(limitNum, skipNum);
    
    return {
      games: result.games,
      total: result.total,
      base_url: result.base_url
    };
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Obtener todos los juegos de casino live ND activos' })
  async getCLGames() {
    console.log('Controller getCLGames called');
    
    const result = await this.casinoLiveService.getCLGames();
    
    return {
      games: result.games,
      base_url: result.base_url
    };
  }
}