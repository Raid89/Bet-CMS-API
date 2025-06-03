import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../../../guards/auth.guard';
import { CasinoVipGamesService } from './casino-vip-games.service';

@Controller('clnd-vip')
export class CasinoVipGamesController {
  constructor(
    private readonly casinoVipGamesService: CasinoVipGamesService,
    private readonly configService: ConfigService,
  ) {}

  // Helper function to convert files array to object structure
  private convertFilesToObject(files: any[]): any {
    if (!files || files.length === 0) {
      return null;
    }

    const filesObj: any = {};
    files.forEach(file => {
      if (!filesObj[file.fieldname]) {
        filesObj[file.fieldname] = {
          ...file,
          mv: async (path: string) => {
            const fs = require('fs').promises;
            await fs.writeFile(path, file.buffer);
          }
        };
      }
    });

    return filesObj;
  }

  @Get('get-integration-channel-codes')
  @UseGuards(AuthGuard)
  async getChannelCodes() {
    const integrationChannelCodes = await this.casinoVipGamesService.getChannelCodes();
    return {
      integrationChannelCodes,
    };
  }

  @Post('new-integrationChannelCode')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async newIntegrationChannelCode(
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    const filesObj = this.convertFilesToObject(files);
    const createdChannel = await this.casinoVipGamesService.newIntegrationChannelCode(body, filesObj);
    return {
      createdChannel,
    };
  }

  @Delete('delete-channel-code/:id')
  @UseGuards(AuthGuard)
  async deleteChannelCode(@Param('id') id: string) {
    const deleted = await this.casinoVipGamesService.deleteChannelCode(id);
    return {
      deleted,
    };
  }

  @Post('new-game')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async newGame(
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    const filesObj = this.convertFilesToObject(files);
    const createdGame = await this.casinoVipGamesService.newGame(body, filesObj);
    return {
      createdGame,
    };
  }

  @Put('update-game/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateGame(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    const filesObj = this.convertFilesToObject(files);
    const updatedGame = await this.casinoVipGamesService.updateGame(id, body, filesObj);
    return {
      updatedGame,
    };
  }

  @Delete('delete-game/:id')
  @UseGuards(AuthGuard)
  async deleteGame(@Param('id') id: string) {
    const deleted = await this.casinoVipGamesService.deleteGame(id);
    return {
      deleted,
    };
  }

  @Get('get-cms/:limit/:skip')
  async getGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;

    const { games, total } = await this.casinoVipGamesService.getGamesCLCMS(limitNum, skipNum);
    return {
      games,
      total,
      base_url: this.configService.get('IMAGESHOST') + '/cl/',
    };
  }

  @Get('get-cms-filter/:limit/:skip')
  async getFilterGamesCLCMS(
    @Param('limit') limit: string,
    @Param('skip') skip: string,
    @Query('criteria') criteria?: string,
    @Query('integrationChannelCode') integrationChannelCode?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const limitNum = parseInt(limit) || 30;
    const skipNum = parseInt(skip) || 0;

    const response = await this.casinoVipGamesService.getFilterGamesCLCMS(
      limitNum,
      skipNum,
      criteria,
      integrationChannelCode,
      categoryId,
    );

    return {
      total: response.total,
      base_url: this.configService.get('IMAGESHOST') + '/cl/',
      games: response.games,
    };
  }

  @Get('get-all')
  async getCLGames() {
    const games = await this.casinoVipGamesService.getCLGames();
    return {
      games,
      base_url: this.configService.get('IMAGESHOST') + '/cl/',
    };
  }

  @Post('banners/new-banner')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async addPromoBanner(
    @Req() req: any,
    @UploadedFiles() files: any[],
  ) {
    const filesObj = this.convertFilesToObject(files);
    const data = {
      body: req.body,
      files: filesObj,
    };
    return await this.casinoVipGamesService.addPromoBanner(data);
  }

  @Get('banners/get-banners')
  async getCLBanners() {
    return await this.casinoVipGamesService.getCLBanners();
  }

  @Post('banners/remove-banner/:id')
  @UseGuards(AuthGuard)
  async removePromoBanner(@Param('id') id: string) {
    return await this.casinoVipGamesService.removePromoBanner(id);
  }

  @Post('update-single-banner/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updatePromoBanner(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFiles() files: any[],
  ) {
    const filesObj = this.convertFilesToObject(files);
    return await this.casinoVipGamesService.updatePromoBanner(id, data, filesObj);
  }

  @Get('get-categories')
  async getCategories() {
    const categories = await this.casinoVipGamesService.getCategories();
    return {
      categories,
    };
  }

  @Post('get-categories')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async newCategory(
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    body.date = new Date();
    body.position = 0;
    
    const filesObj = this.convertFilesToObject(files);
    const createdCategiry = await this.casinoVipGamesService.newCategory(body, filesObj);
    return {
      createdCategiry,
    };
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param('id') id: string) {
    const deleted = await this.casinoVipGamesService.deleteCategory(id);
    return {
      deleted,
    };
  }

  @Put('categories/:id')
  @UseGuards(AuthGuard)
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    const updatedCategory = await this.casinoVipGamesService.updateCategory(id, body);
    return {
      updatedCategory,
    };
  }

  @Get('get-categories-cl')
  async getCategoriesCL() {
    const categories = await this.casinoVipGamesService.getCategoriesCL();
    return {
      categories,
      base_url: this.configService.get('IMAGESHOST') + '/cl/',
    };
  }

  @Get('category/:id/all')
  async getAllCLNDvipByCategoryId(@Param('id') id: string) {
    const data = await this.casinoVipGamesService.getAllCLNDvipByCategoryId(id);
    return {
      ok: true,
      data,
    };
  }
}