import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { HomeService } from './home.service';
import { NextLoggerService } from '../../../modules/logger/logger.service';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateHomeImageDto, UpdateHomeImageDto } from './dto/home.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Appearance - Home')
@Controller('appearance')
export class HomeController {

    constructor(
        private homeService: HomeService,
        private logger: NextLoggerService,
    ) {}

    @Get('home-images')
    @ApiOperation({ summary: 'Obtener las imagenes para el home' })
    @ApiResponse({ status: 200, description: 'Imagenes obtenidas correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al obtener las imagenes para el home' })
    async getHomeImages(@Res() res: Response) {
        try {
            const images = await this.homeService.getHomeImages();
            res.status(200).json(images);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el home', 'getHomeImages', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al obtener las imagenes para el home'});
        }
    }

    @Get('home-images/cms/:start/:limit')
    @ApiParam({ name: 'start', type: Number, required: true, description: 'Desde que imagen se quiere obtener' })
    @ApiParam({ name: 'limit', type: Number, required: true, description: 'Cantidad de imagenes a obtener'})
    @ApiHeader({ name: 'Authorization', required: true, description: 'Bearer token' })
    @ApiOperation({ summary: 'Obtener las imagenes para el home para el cms' })
    @ApiResponse({ status: 200, description: 'Imagenes obtenidas correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al obtener las imagenes para el home' })
    async getHomeImagesToCms(@Param('start') start: number, @Param('limit') limit: number,  @Res() res: Response) {
        try {
            const images = await this.homeService.getHomeImagesToCms(start, limit);
            res.status(200).json(images);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el home', 'getHomeImagesToCms', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al obtener las imagenes para el home'});
        }
    }

    @Post('home-image')
    @ApiSecurity('bearer')
    @ApiBody({ type: CreateHomeImageDto })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Agregar una imagen para el home' })
    @ApiResponse({ status: 200, description: 'Imagen agregada correctamente' })
    @UseInterceptors(FileInterceptor('image'))
    async addHomeImage(@Res() res: Response, @UploadedFile() image: any, @Body() HomeImageData: CreateHomeImageDto) {
        try {
            const imageResponse = await this.homeService.createHomeImage(HomeImageData, image);
            res.status(200).json(imageResponse);
        } catch (error) {
            console.log(error)
            this.logger.error('Ha ocurrido un error al agregar una imagen para el home', 'addHomeImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al agregar una imagen para el home'});
        }
    }

    @Put('home-image/:id')
    @ApiSecurity('bearer')
    @ApiBody({ type: UpdateHomeImageDto })
    @ApiOperation({ summary: 'Actualizar una imagen para el home' })
    @ApiResponse({ status: 200, description: 'Imagen actualizada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al actualizar una imagen para el home' })
    async updateHomeImage(@Res() res: Response, @Param('id') id: string, @Body() HomeImageData: UpdateHomeImageDto) {
        try {
            const image = await this.homeService.updateHomeImage(id, HomeImageData);
            res.status(200).json(image);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen para el home', 'updateHomeImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al actualizar una imagen para el home'});
        }
    }

    @Delete('home-image/:id')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Eliminar una imagen para el home' })
    @ApiResponse({ status: 200, description: 'Imagen eliminada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al eliminar una imagen para el home' })
    async deleteHomeImage(@Res() res: Response, @Param('id') id: string) {
        try {
            const image = await this.homeService.deleteHomeImage(id);
            res.status(200).json(image);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar una imagen para el home', 'deleteHomeImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al eliminar una imagen para el home'});
        }
    }
}
