import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PromoBannerService } from './promo-banners.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePromoBannerDto, UpdatePromoBannerDto } from './dto/promo-banners.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Promotions - Banners')
@Controller('promociones')
export class PromoBannerController {

    constructor(
        private promoBannerService: PromoBannerService,
    ){}

    @Get('banners/get-banners')
    @ApiOperation({ summary: 'Obtener el listado de banners del módulo promociones' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Lista de banners obtenida correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener la lista de banners' })
    @HttpCode(HttpStatus.OK)
    async getPromoBanners(){
        return await this.promoBannerService.getPromoBanners();
    }

    @Post('banners/new-banner')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Agregar un banner de promoción' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Banner de promoción agregado correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al agregar el banner de promoción' })
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async createPromoBanner(@Body() bannerData: CreatePromoBannerDto, @UploadedFile() file: any){
        return await this.promoBannerService.createPromoBanner(bannerData, file);
    }

    @Post('update-single-banner/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Modificar un banner de promoción' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Banner de promoción modificado correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al modificar  el banner de promoción' })
    @HttpCode(HttpStatus.OK)
    async updatePromoBanner(@Param('id') bannerId: string, @Body() bannerData: UpdatePromoBannerDto){
        return await this.promoBannerService.updatePromoBanner(bannerId, bannerData);
    }

    @Post('banners/remove-banner/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Eliminar un banner de promoción' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Banner de promoción eliminado correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al eliminar el banner de promoción' })
    @HttpCode(HttpStatus.OK)
    async deletePromoBanner(@Param('id') bannerId: string){
        return await this.promoBannerService.deletePromoBanner(bannerId);
    }
}