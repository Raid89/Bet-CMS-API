import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateImagesDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileStorageService } from 'src/common/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
    constructor(
        private readonly ImagesService: ImagesService,
        private readonly fileService: FileStorageService
    ) {}

    @Get('get-all/:limit/:skip')
    async findAllImages(@Param('limit') limit: number, @Param('skip') skip: number) {
        return this.ImagesService.findAllImages(limit, skip);
    }

    @Post('new-image')
    @ApiBody({ type: CreateImagesDto})
    @UseInterceptors(FileInterceptor('image'))
    async createImage(
        @Body() createImageDto: CreateImagesDto, 
        @UploadedFile() image: any
    ) {
        return this.ImagesService.createImage(createImageDto, image);
    }

    @Post('remove-image/:id')
    async removeImage(@Param('id') id: string) {}

    @Post('update-image/:id')
    @ApiBody({ type: UpdateImageDto})
    async updateImage(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
        return this.ImagesService.updateImage(id, updateImageDto);
    }
}