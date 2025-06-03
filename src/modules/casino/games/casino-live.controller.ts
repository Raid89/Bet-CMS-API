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

@ApiTags('Casino Live ND')
@Controller()
export class CasinoLiveController {
  constructor(private readonly casinoLiveService: CasinoLiveService) {}

  // Channels
  @Get('clnd/get-integration-channel-codes')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Obtener códigos de canal de integración' })
  async getChannelCodes() {
    return await this.casinoLiveService.getChannelCodes();
  }

  @Post('clnd/new-integrationChannelCode')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear nuevo código de canal de integración' })
  async newIntegrationChannelCode(@Body() channelData: any) {
    return await this.casinoLiveService.newIntegrationChannelCode(channelData);
  }

  @Delete('clnd/delete-channel-code/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar código de canal' })
  @ApiParam({ name: 'id', description: 'ID del canal' })
  async deleteChannelCode(@Param('id') id: string) {
    return await this.casinoLiveService.deleteChannelCode(id);
  }

  // Games
  @Post('clnd/new-game')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear un nuevo juego de casino live ND' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async newGame(
    @Body() createGameDto: CreateCasinoLiveDto,
    @UploadedFiles() files: any,
    @Req() req: Request
  ) {
    return await this.casinoLiveService.newGame(createGameDto, files);
  }

  @Put('clnd/update-game/:id')
  @ApiSecurity('bearer')
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
    return await this.casinoLiveService.updateGame(id, updateGameDto, files);
  }

  @Delete('clnd/delete-game/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar un juego de casino live ND' })
  @ApiParam({ name: 'id', description: 'ID del juego' })
  async deleteGame(@Param('id') id: string) {
    return await this.casinoLiveService.deleteGame(id);
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
    return await this.casinoLiveService.getGamesCLCMS(limitNum, skipNum);
  }

  @Get('clnd/get-cms-filter/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos filtrados para CMS' })
  @ApiParam({ name: 'limit', description: 'Límite de elementos' })
  @ApiParam({ name: 'skip', description: 'Elementos a omitir' })
  async getFilterGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    return await this.casinoLiveService.getFilterGamesCLCMS(limitNum, skipNum);
  }

  @Get('clnd/get-all')
  @ApiOperation({ summary: 'Obtener todos los juegos activos' })
  async getCLGames() {
    return await this.casinoLiveService.getCLGames();
  }

  // Banners
  @Post('clnd/banners/new-banner')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear nuevo banner promocional' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async addPromoBanner(@Body() bannerData: any, @UploadedFiles() files: any) {
    return await this.casinoLiveService.addPromoBanner(bannerData, files);
  }

  @Get('clnd/banners/get-banners')
  @ApiOperation({ summary: 'Obtener banners' })
  async newGetCLBanners() {
    return await this.casinoLiveService.newGetCLBanners();
  }

  @Get('clnd/banners/new-get-banners')
  @ApiOperation({ summary: 'Obtener nuevos banners' })
  async newGetCLBannersNew() {
    return await this.casinoLiveService.newGetCLBanners();
  }

  @Post('clnd/banners/remove-banner/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar banner promocional' })
  @ApiParam({ name: 'id', description: 'ID del banner' })
  async removePromoBanner(@Param('id') id: string) {
    return await this.casinoLiveService.removePromoBanner(id);
  }

  @Post('clnd/update-single-banner/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar banner individual' })
  @ApiParam({ name: 'id', description: 'ID del banner' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updatePromoBanner(
    @Param('id') id: string,
    @Body() bannerData: any,
    @UploadedFiles() files: any
  ) {
    return await this.casinoLiveService.updatePromoBanner(id, bannerData, files);
  }

  // Categories
  @Get('cl/nd/get-categories')
  @ApiOperation({ summary: 'Obtener categorías' })
  async getCategories() {
    return await this.casinoLiveService.getCategories();
  }

  @Post('cl/nd/get-categories')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear nueva categoría' })
  async newCategory(@Body() categoryData: any) {
    return await this.casinoLiveService.newCategory(categoryData);
  }

  @Delete('cl/nd/categories/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  async deleteCategory(@Param('id') id: string) {
    return await this.casinoLiveService.deleteCategory(id);
  }

  @Put('cl/nd/categories/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    return await this.casinoLiveService.updateCategory(id, categoryData);
  }

  @Get('cl/nd/get-categories-cl')
  @ApiOperation({ summary: 'Obtener categorías CL' })
  async getCategoriesCL() {
    return await this.casinoLiveService.getCategoriesCL();
  }

  // Masive operations
  @Post('clnd/new-clgame-masive')
  @ApiOperation({ summary: 'Carga masiva de juegos CL' })
  async clGameMasiveCharge(@Body() gameData: any) {
    return await this.casinoLiveService.clGameMasiveCharge(gameData);
  }

  @Post('clnd/delete-clgame-masive')
  @ApiOperation({ summary: 'Eliminación masiva de juegos CL' })
  async deleteClGameMasive(@Body() gameData: any) {
    return await this.casinoLiveService.deleteClGameMasive(gameData);
  }

  // Additional endpoints
  @Get('cl/nd/get-single-cl/:id')
  @ApiOperation({ summary: 'Obtener juego individual CL' })
  @ApiParam({ name: 'id', description: 'ID del juego' })
  async getSingleCLGame(@Param('id') id: string) {
    return await this.casinoLiveService.getSingleCLGame(id);
  }

  @Post('cl/nd/get-games-by-tags')
  @ApiOperation({ summary: 'Obtener juegos por tags' })
  async getGamesByTags(@Body() tagData: any) {
    return await this.casinoLiveService.getGamesByTags(tagData);
  }

  @Get('cl/nd/get-games-criteria/:limit/:skip')
  @ApiOperation({ summary: 'Obtener juegos por criterios' })
  @ApiParam({ name: 'limit', description: 'Límite de elementos' })
  @ApiParam({ name: 'skip', description: 'Elementos a omitir' })
  async getGamesCriteria(
    @Param('limit') limit: string,
    @Param('skip') skip: string
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;
    return await this.casinoLiveService.getGamesCriteria(limitNum, skipNum);
  }
}
