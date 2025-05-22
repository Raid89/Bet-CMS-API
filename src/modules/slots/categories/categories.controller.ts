import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoriesDto } from './dto/response-categories.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Slots - Categories')
@Controller('slots')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('category')
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ type: ResponseCategoriesDto })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseCategoriesDto> {
    return await this.categoriesService.SlotsCategoriescreate(createCategoryDto);
  }

  @Get('categories/:limit/:skip')
  @ApiParam({ name: 'limit' })
  @ApiParam({ name: 'skip' })
  @ApiResponse({ type: ResponseCategoriesDto })
  findAll(@Param() param: { limit: number, skip: number }): Promise<ResponseCategoriesDto> {
    return this.categoriesService.SlotsCategoriesFind(param);
  }
  
  @Get('new/categories/sisplay')
  @ApiResponse({ type: ResponseCategoriesDto })
  async findAllCategoryWithGames(): Promise<ResponseCategoriesDto> {
    return await this.categoriesService.findAllCategoryWithGames(1, true);
  }

  @Get('category/:id/all')
  @ApiResponse({ type: ResponseCategoriesDto })
  async SlotsByCategoryFindAll(@Param('id') id: string): Promise<ResponseCategoriesDto> {
    return await this.categoriesService.SlotsByCategoryFindAll(id);
  }

  @Get('categories/:categoryId/:start/:limit/sisplay')
  @ApiResponse({ type: ResponseCategoriesDto })
  async SlotsByCategoryFindPaginate(@Param('categoryId') categoryId: string, @Param('start') start: number, @Param('limit') limit: number): Promise<ResponseCategoriesDto> {
    return await this.categoriesService.SlotsByCategoryFindPaginate(categoryId, start, limit);
  }

  @Put('category/:id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ type: ResponseCategoriesDto })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<ResponseCategoriesDto> {
    return await this.categoriesService.SlotsCategoriesupdate(id, updateCategoryDto);
  }

  @Delete('category/:id')
  @ApiResponse({ type: ResponseCategoriesDto })
  remove(@Param('id') id: string) {
    return this.categoriesService.SlotsCategoriesremove(id);
  }
}
