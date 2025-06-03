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
  Query,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CasinoGamesService } from './casino-games.service';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';

@ApiTags('Casino Live ND')
@Controller()
export class CasinoGamesController {
  constructor(private readonly casinoGamesService: CasinoGamesService) {}
  
  // Channels
  @Get('clnd/get-integration-channel-codes')
  @ApiOperation({ summary: 'Obtener códigos de canal de integración' })
  async getChannelCodes() {
    return await this.casinoGamesService.getChannelCodes();
  }

  @Post('clnd/new-integrationChannelCode')
  @ApiOperation({ summary: 'Crear nuevo código de canal de integración' })
  async newIntegrationChannelCode(@Body() channelData: any) {
    return await this.casinoGamesService.newIntegrationChannelCode(channelData);
  }

  @Delete('clnd/delete-channel-code/:id')
  @ApiOperation({ summary: 'Eliminar código de canal' })
  @ApiParam({ name: 'id', description: 'ID del canal' })
  async deleteChannelCode(@Param('id') id: string) {
    return await this.casinoGamesService.deleteChannelCode(id);
  }

  // Games  @Post('clnd/new-game')
  @ApiOperation({ summary: 'Crear un nuevo juego de casino live ND' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async newGame(
    @Body() createGameDto: CreateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    return await this.casinoGamesService.newGameCasinoLive(createGameDto, files);
  }

  @Put('clnd/update-game/:id')
  @ApiOperation({ summary: 'Actualizar un juego de casino live ND' })
  @ApiParam({ name: 'id', description: 'ID del juego' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updateGame(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    return await this.casinoGamesService.updateGame(id, updateGameDto, files);
  }

  @Delete('clnd/delete-game/:id')
  @ApiOperation({ summary: 'Eliminar un juego de casino live ND' })
  @ApiParam({ name: 'id', description: 'ID del juego' })
  async deleteGame(@Param('id') id: string) {
    return await this.casinoGamesService.deleteGame(id);
  }
  @Get('clnd/get-cms/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos para CMS con paginación' })
  @ApiParam({ name: 'limit', description: 'Límite de elementos' })
  @ApiParam({ name: 'skip', description: 'Elementos a omitir' })
  async getGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    const { games, total } = await this.casinoGamesService.getGamesCLCMS(limitNum, skipNum);
    return {
      games,
      total,
      base_url: process.env.IMAGESHOST + "/" + "cl/",
    };
  }  @Get('clnd/get-cms-filter/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos filtrados para CMS' })
  @ApiParam({ name: 'limit', description: 'Límite de elementos' })
  @ApiParam({ name: 'skip', description: 'Elementos a omitir' })
  async getFilterGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Req() req: Request
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    const criteria = req.query.criteria as string || '';
    const integrationChannelCode = req.query.integrationChannelCode as string || '';
    const categoryId = req.query.categoryId as string || '';

    const response = await this.casinoGamesService.getFilterGamesCLCMS(limitNum, skipNum, criteria, integrationChannelCode, categoryId);
    
    if(categoryId === ""){
      return {
        total: response.total, 
        base_url: process.env.IMAGESHOST + "/" + "cl/", 
        games: response.games
      };
    } else {
      const response2 = await this.casinoGamesService.getFilterGamesCLCMSArray(limitNum, skipNum, criteria, integrationChannelCode, categoryId);
      return {
        total: response.total + response2.total, 
        base_url: process.env.IMAGESHOST + "/" + "cl/", 
        games: [...response.games, ...response2.games].sort((a: any, b: any) => a.position - b.position)
      };
    }
  }
  @Get('clnd/get-all')
  @ApiOperation({ summary: 'Obtener todos los juegos activos' })
  async getCLGames(@Req() req: Request) {
    const iosVersion = req.headers.iosversion as string;
    const games = await this.casinoGamesService.getCLGames(iosVersion);
    return {
      games,
      base_url: process.env.IMAGESHOST + "/" + "cl/",
    };
  }

  // Banners
  @Post('clnd/banners/new-banner')
  @ApiOperation({ summary: 'Crear nuevo banner promocional' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async addPromoBanner(@Body() bannerData: any, @UploadedFiles() files: any) {
    return await this.casinoGamesService.addPromoBanner(bannerData, files);
  }

  @Get('clnd/banners/get-banners')
  @ApiOperation({ summary: 'Obtener banners' })
  async newGetCLBanners() {
    return await this.casinoGamesService.newGetCLBanners();
  }

  @Get('clnd/banners/new-get-banners')
  @ApiOperation({ summary: 'Obtener nuevos banners' })
  async newGetCLBannersNew() {
    return await this.casinoGamesService.newGetCLBanners();
  }

  @Post('clnd/banners/remove-banner/:id')
  @ApiOperation({ summary: 'Eliminar banner promocional' })
  @ApiParam({ name: 'id', description: 'ID del banner' })
  async removePromoBanner(@Param('id') id: string) {
    return await this.casinoGamesService.removePromoBanner(id);
  }
  @Post('clnd/update-single-banner/:id')
  @ApiOperation({ summary: 'Actualizar banner individual' })
  @ApiParam({ name: 'id', description: 'ID del banner' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updatePromoBanner(
    @Param('id') id: string,
    @Body() bannerData: any,
    @UploadedFiles() files: any
  ) {
    return await this.casinoGamesService.updatePromoBanner(id, bannerData);
  }

  // Categories
  @Get('cl/nd/get-categories')
  @ApiOperation({ summary: 'Obtener categorías' })
  async getCategories() {
    return await this.casinoGamesService.getCategories();
  }

  @Post('cl/nd/get-categories')
  @ApiOperation({ summary: 'Crear nueva categoría' })
  async newCategory(@Body() categoryData: any) {
    return await this.casinoGamesService.newCategory(categoryData);
  }

  @Delete('cl/nd/categories/:id')
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  async deleteCategory(@Param('id') id: string) {
    return await this.casinoGamesService.deleteCategory(id);
  }

  @Put('cl/nd/categories/:id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    return await this.casinoGamesService.updateCategory(id, categoryData);
  }  @Get('cl/nd/get-categories-cl')
  @ApiOperation({ summary: 'Obtener categorías CL' })
  async getCategoriesCL(@Req() req: Request) {
    const iosVersion = req.headers.iosversion as string;
    const categories = await this.casinoGamesService.getCategoriesCL(iosVersion);
    return {
      categories,
      base_url: process.env.IMAGESHOST + "/" + "cl/",
    };
  }

  // Masive operations
  @Post('clnd/new-clgame-masive')
  @ApiOperation({ summary: 'Carga masiva de juegos CL' })
  async clGameMasiveCharge(@Body() gameData: any) {
    return await this.casinoGamesService.clGameMasiveCharge(gameData);
  }

  @Post('clnd/delete-clgame-masive')
  @ApiOperation({ summary: 'Eliminación masiva de juegos CL' })
  async deleteClGameMasive(@Body() gameData: any) {
    return await this.casinoGamesService.deleteClGameMasive(gameData);
  }

  // Additional endpoints
  @Get('cl/nd/get-single-cl/:id')
  @ApiOperation({ summary: 'Obtener juego individual CL' })
  @ApiParam({ name: 'id', description: 'ID del juego' })
  async getSingleCLGame(@Param('id') id: string) {
    return await this.casinoGamesService.getSingleCLGame(id);
  }  @Post('cl/nd/get-games-by-tags')
  @ApiOperation({ summary: 'Obtener juegos por tags' })
  async getGamesByTags(@Body() tagData: any) {
    const { tags, limit } = tagData;
    const result = await this.casinoGamesService.getGamesByTags(tags || [], limit || 10);
    return { 
      result, 
      base_url: process.env.IMAGESHOST + "/" + "cl/",
    };
  }  @Get('cl/nd/get-games-criteria/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos por criterios' })
  @ApiParam({ name: 'limit', description: 'Límite de elementos' })
  @ApiParam({ name: 'skip', description: 'Elementos a omitir' })
  async getGamesCriteria(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Req() req: Request
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    const criteria = req.query.criteria as string || '';
    const iosVersion = req.headers.iosversion as string;
    const result = await this.casinoGamesService.getGamesCriteria(limitNum, skipNum, criteria, iosVersion);
    return { 
      result, 
      base_url: process.env.IMAGESHOST + "/" + "cl/",
    };
  }
}
