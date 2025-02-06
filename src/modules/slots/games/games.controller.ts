import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SlotsGamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

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
}
