import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PromoService } from './promotions.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePromoDto, UpdatePromoDto } from './dto/promotions.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Promotions - Promociones')
@Controller('promociones')
export class PromoController {

    constructor(
        private promoService: PromoService,
    ){}

    @Get('get-all/:limit/:skip')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener las promociones para el CMS' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promociones obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las promociones' })
    @HttpCode(HttpStatus.OK)
    async getPromosCMS(@Param('start') start: number, @Param('limit') limit: number){
            return await this.promoService.getPromosCMS(start, limit);
    }

    @Get('get-all-filter/:limit/:skip')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener las promociones filtradas para el CMS' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promociones obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las promociones' })
    @HttpCode(HttpStatus.OK)
    async getFilterPromosCMS(@Param('start') start: number, @Param('limit') limit: number, @Query('criteria') criteria: string){
            return await this.promoService.getFilterPromosCMS(start, limit, criteria);
    }

    @Get('get-single-promo/:id')
    @ApiOperation({ summary: 'Obtener el detalle de la promoción por ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promoción obtenida correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener la promoción' })
    @HttpCode(HttpStatus.OK)
    async getSinglePromoById(@Param('id') promoId: string){
        return await this.promoService.getSinglePromoById(promoId);
    }

    @Get('get-single-promo-name/:name')
    @ApiOperation({ summary: 'Obtener el detalle de la promoción por Nombre' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promoción obtenida correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener la promoción' })
    @HttpCode(HttpStatus.OK)
    async getSinglePromoByName(@Param('name') promoName: string){
        return await this.promoService.getSinglePromoByName(promoName);
    }

    @Post('new-promo')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Agregar una promoción' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Promoción agregada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al agregar la promoción' })
    @HttpCode(HttpStatus.CREATED)
    async createPromo(@Body() promoData: CreatePromoDto){
        return await this.promoService.createPromo(promoData);
    }

    @Post('set-feature-image/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Agregar una promoción' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Promoción agregada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al agregar la promoción' })
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async setPromoImage(@Param('id') promoId: string, @UploadedFile() file: any){
        return await this.promoService.setPromoImage(promoId, file);
    }

    @Post('update-single-promo/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Modificar una promoción' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promoción modificada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al modificar la promoción' })
    @HttpCode(HttpStatus.OK)
    async updatePromo(@Param('id') promoId: string, @Body() promoData: UpdatePromoDto){
        return await this.promoService.updatePromo(promoId, promoData);
    }

    @Post('remove-promo/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Eliminar una promoción' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Promoción eliminada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al eliminar la promoción' })
    @HttpCode(HttpStatus.OK)
    async deletePromo(@Param('id') promoId: string){
        return await this.promoService.deletePromo(promoId);
    }
}