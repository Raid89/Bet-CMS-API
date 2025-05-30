import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Slots - Categorías')
@Controller('slots')
export class CategoriesController {

  constructor(
    private readonly configService: ConfigService,
    private readonly categoriesService: CategoriesService
  ) {}

  @Get('categories/:limit/:skip')
  @ApiOperation({ summary: 'Obtener categorías con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de categorías paginadas.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud. Verifique los parámetros de paginación.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findPaginated(
    @Param('limit') limit: number,
    @Param('skip') skip: number
  ) {
    const categories = await this.categoriesService.findPaginated(limit, skip);
    return {
      ok: true,
      imagePath: `${this.configService.get('IMAGE_HOST')}/slots/`,
      data: categories,
      total: categories.length,
    }
  }

  @Get('categories/all')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de todas las categorías.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post('category')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Crea una nueva categoría con una imagen asociada.' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear la categoría. Verifique los datos proporcionados.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() image: any) {
    return this.categoriesService.create(createCategoryDto, image);
  }

  @Put('category/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Actualizar una categoría existente' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la categoría. Verifique los datos proporcionados.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('category/:id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
