import { Controller, Delete, Get, Param, Post, Put, Body, Res, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { NextLoggerService } from '../../../modules/logger/logger.service';
import { PokerService } from './poker.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreatedPokerImageDto, UpdatePokerDtoUrl, UpdatePokerImageDto } from './dto/poker.dto';
import { PokerUrl } from './poker.schema';

@ApiTags('Appearance - Poker')
@Controller('appearance')
export class PokerController {
    constructor(
        private pokerService: PokerService,
        private logger: NextLoggerService,
    ) {}

    @Get('poker-images')
    @ApiOperation({ summary: 'Obtener las imagenes para el poker' })
    @ApiResponse({ status: 200, description: 'Imagenes obtenidas correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al obtener las imagenes para el poker' })
    async getPokerImages(@Res() res: Response) {
        try {
            const images = await this.pokerService.getImagesPoker();
            res.status(200).json(images);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el poker', 'getPokerImages', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al obtener las imagenes para el poker'});
        }
    }

    @Get('poker-images/cms/:limit/:skip')
    @ApiOperation({ summary: 'Obtener las imagenes para el poker para el cms' })
    @ApiResponse({ status: 200, description: 'Imagenes obtenidas correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al obtener las imagenes para el poker' })
    async getPokerImagesToCms(@Query('skip') skip: number, @Query('limit') limit: number, @Res() res: Response) {
        try {
            const images = await this.pokerService.gePokerImagesToCms(skip, limit);
            res.status(200).json(images);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el poker', 'getPokerImagesToCms', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al obtener las imagenes para el poker'});
        }
    }

    @Post('poker-image')
    @ApiOperation({ summary: 'Agregar una imagen para el poker' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreatedPokerImageDto })
    @ApiResponse({ status: 200, description: 'Imagen agregada correctamente' })
    @UseInterceptors(FileInterceptor('image'))
    async addPokerImage(@Body() data: CreatedPokerImageDto, @UploadedFile() file: any, @Res() res: Response) {
        try {
            const newImage = await this.pokerService.createPokerImage(data, file);
            res.status(200).json(newImage);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al agregar una imagen para el poker', 'addPokerImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al agregar una imagen para el poker'});
        }
    }

    @Put('poker-image/:id')
    @ApiOperation({ summary: 'Actualizar una imagen del poker' })
    @ApiBody({ type: UpdatePokerImageDto })
    @ApiResponse({ status: 200, description: 'Imagen actualizada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al actualizar la imagen del poker' })
    async updatePokerImage(@Param('id') id: string, @Body() data: UpdatePokerImageDto, @Res() res: Response) {
        try {
            const updatedImage = await this.pokerService.updatePokerImage(id, data);
            res.status(200).json(updatedImage);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen del poker', 'updatePokerImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al actualizar una imagen del poker'});
        }
    }

    @Put('poker-position/image/:id')
    @ApiOperation({ summary: 'Actualizar la posición de una imagen del poker' })
    @ApiBody({ type: UpdatePokerImageDto })
    @ApiResponse({ status: 200, description: 'Posición de la imagen actualizada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al actualizar la posición de la imagen del poker' })
    async updatePokerImagePosition(@Param('id') id: string, @Body() data: UpdatePokerImageDto, @Res() res: Response) {
        try {
            const updatedImage = await this.pokerService.pokerPosition(id, data);
            res.status(200).json(updatedImage);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar la posición de una imagen del poker', 'updatePokerImagePosition', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al actualizar la posición de una imagen del poker'});
        }
    }

    @Put('poker-image/active/:id')
    @ApiOperation({ summary: 'Activar o desactivar una imagen del poker' })
    @ApiResponse({ status: 200, description: 'Imagen activada o desactivada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al activar o desactivar la imagen del poker' })
    async changePokerImageState(@Param('id') id: string, @Res() res: Response) {
        try {
            const updatedImage = await this.pokerService.changePokerImageState(id);
            res.status(200).json(updatedImage);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al activar o desactivar una imagen del poker', 'changePokerImageState', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al activar o desactivar una imagen del poker'});
        }
    }
        
    @Delete('poker-image/:id')
    @ApiOperation({ summary: 'Eliminar una imagen del poker' })
    @ApiResponse({ status: 200, description: 'Imagen eliminada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al eliminar la imagen del poker' })
    async deletePokerImage(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.pokerService.deletePokerImage(id);
            res.status(200).json({message: 'Imagen eliminada correctamente'});
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar una imagen del poker', 'deletePokerImage', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al eliminar una imagen del poker'});
        }
    }

    @Get('poker-url')
    @ApiOperation({ summary: 'Obtener la URL activa del poker' })
    @ApiResponse({ status: 200, description: 'URL obtenida correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al obtener la URL del poker' })
    async getPokerUrl(@Res() res: Response) {
        try {
            const url = await this.pokerService.getPokerUrl();
            res.status(200).json(url);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener la URL del poker', 'getPokerUrl', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al obtener la URL del poker'});
        }
    }

    @Put('poker-url')
    @ApiOperation({ summary: 'Actualizar la URL del poker' })
    @ApiBody({ type: UpdatePokerDtoUrl })
    @ApiResponse({ status: 200, description: 'URL actualizada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al actualizar la URL del poker' })
    async updatePokerUrl(@Body() data: UpdatePokerDtoUrl, @Res() res: Response) {
        try {
            const updatedUrl = await this.pokerService.updatePokerUrl(data);
            res.status(200).json(updatedUrl);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar la URL del poker', 'updatePokerUrl', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al actualizar la URL del poker'});
        }
    }

    @Put('poker-url/image/:id')
    @ApiOperation({ summary: 'Actualizar la URL de una imagen del poker' })
    @ApiBody({ type: UpdatePokerDtoUrl })
    @ApiResponse({ status: 200, description: 'URL de la imagen actualizada correctamente' })
    @ApiResponse({ status: 422, description: 'Ha ocurrido un error al actualizar la URL de la imagen del poker' })
    async updatePokerImageUrl(@Param('id') id: string, @Body() data: UpdatePokerImageDto, @Res() res: Response) {
        try {
            const updatedUrl = await this.pokerService.updateImagePokerUrl(id, data);
            res.status(200).json(updatedUrl);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar la URL de una imagen del poker', 'updatePokerImageUrl', JSON.stringify(error));
            res.status(422).json({message: 'Ha ocurrido un error al actualizar la URL de una imagen del poker'});
        }
    }
}
