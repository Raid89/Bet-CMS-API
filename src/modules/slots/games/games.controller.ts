import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SlotsGamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SlotsDocument } from './schemas/games.schema';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Slots - Games')
@Controller('slots')
export class SlotsGamesController {
  constructor(private readonly gamesService: SlotsGamesService) {}

  @Get('get-all-cms/:limit/:skip')
  @ApiQuery({ name: 'criteria', required: false })
  @ApiQuery({ name: 'integrationChannelCode', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async SlotsGamesCmsFindAll(
    @Param('limit') limit: number,
    @Param('skip') skip: number,
    @Query('criteria',) criteria?: string,
    @Query('integrationChannelCode') integrationChannelCode?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return await this.gamesService.SlotsGamesFindAllCms(
      limit,
      skip,
      criteria,
      integrationChannelCode,
      categoryId,
    );
  }

  @Get('get-single-slot/:id')
  async SlotsGamesFindOne(@Param('id') gameId: string): Promise<SlotsDocument> {
    return await this.gamesService.SlotsGamesFindOne(gameId);
  }

  @Post('update-single-slot/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async SlotsGamesUpdateOne(
    @Param('id') gameId: string,
    @Body() updateGameDto: UpdateGameDto,
    @UploadedFiles() files: any,
  ) {
    return await this.gamesService.SlotsGamesUpdate(gameId, updateGameDto, files);
  }
}
