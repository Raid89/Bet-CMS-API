import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Res, UseInterceptors } from '@nestjs/common';
import { PromoCategoriesService } from './promo-categories.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePromoCategoryDto, UpdatePromoCategoryDto } from './dto/promo-categories.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Promotions - Categories')
@Controller('promotions')
export class PromoCategoriesController {

    constructor(
        private promoCategoriesService: PromoCategoriesService,
    ){}

    @Get('categories')
    @ApiOperation({ summary: 'Obtener las promociones por categoria' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Categorias y promociones obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las categorias y promociones' })
    @HttpCode(HttpStatus.OK)
    async getCategoriesAndPromos(){
            return await this.promoCategoriesService.getCategoriesAndPromos();
    }

    @Get('categories/:start/:limit')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener las categorias de las promociones para el CMS' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Categorias de promoción obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las categorias de promoción' })
    @HttpCode(HttpStatus.OK)
    async getPromoCategories(@Param('start') start: number, @Param('limit') limit: number){
            return await this.promoCategoriesService.getPromoCategories(start, limit);
    }

    @Post('category')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Agregar una categoria de promociones' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Categoria agregada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al agregar la categoria' })
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.CREATED)
    async createPromoCategory(@Body() PromoCategoryData: CreatePromoCategoryDto){
        return await this.promoCategoriesService.createPromoCategory(PromoCategoryData);
    }

    @Put('category/:categoryId')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Editar una categoria de promociones' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Categoria editada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al editar la categoria' })
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.OK)
    async updatePromoCategory(@Param('categoryId') categoryId: string, @Body() PromoCategoryData: UpdatePromoCategoryDto){
        return await this.promoCategoriesService.updatePromoCategory(categoryId, PromoCategoryData);
    }

    @Delete('category/:categoryId')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Eliminar una categoria de promociones' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Categoria eliminada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al eliminar la categoria' })
    @HttpCode(HttpStatus.OK)
    async deletePromoCategory(@Param('categoryId') categoryId: string){
        return await this.promoCategoriesService.deletePromoCategory(categoryId);
    }
}