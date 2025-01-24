import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { LogosService } from './logos.service';
import { CreateLogoDto, UpdateLogoDto, UpdateCarouselImageTitleAltDto } from './dto/logos.dto';

@ApiTags('Appearance - Logos')
@Controller('appearance')
export class LogosController {
    constructor(private readonly logosService: LogosService) {}

    @Get('get-feature-logo/:type')
    @ApiOperation({ summary: 'Get current logo by type' })
    @ApiParam({ name: 'type', required: true })
    async getCurrentLogo(@Param('type') type: string) {
        return this.logosService.getCurrentLogo(type);
    }

    @Get('get-logos/:limit/:skip')
    @ApiOperation({ summary: 'Get logos with pagination' })
    @ApiParam({ name: 'limit', required: true })
    @ApiParam({ name: 'skip', required: true })
    async getLogos(@Param('limit') limit: number, @Param('skip') skip: number) {
        return this.logosService.getLogos(limit, skip);
    }

    @Post('new-logo')
    @ApiOperation({ summary: 'Create a new logo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateLogoDto })
    @UseInterceptors(FileInterceptor('image'))
    async newLogo(@Body() data: CreateLogoDto, @UploadedFile() file: any) {
        return this.logosService.newLogo(data, file);
    }

    @Post('update-logo/:id')
    @ApiOperation({ summary: 'Update a logo' })
    @ApiParam({ name: 'id', required: true })
    @ApiBody({ type: UpdateLogoDto })
    async updateLogo(@Param('id') id: string, @Body() data: UpdateLogoDto) {
        return this.logosService.updateLogo(id, data);
    }

    @Post('remove-logo/:id')
    @ApiOperation({ summary: 'Remove a logo' })
    @ApiParam({ name: 'id', required: true })
    async removeLogo(@Param('id') id: string) {
        return this.logosService.removeLogo(id);
    }

    @Post('set-feature-logo/:id/:type')
    @ApiOperation({ summary: 'Set a logo as featured' })
    @ApiParam({ name: 'id', required: true })
    @ApiParam({ name: 'type', required: true })
    async setFeatureLogo(@Param('id') id: string, @Param('type') type: number) {
        return this.logosService.setFeatureLogo(id, type);
    }

    // Carousel
    @Post('set-carousel-image/:type')
    @ApiOperation({ summary: 'Set a carousel image' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'type', required: true })
    @ApiBody({ type: CreateLogoDto })
    @UseInterceptors(FileInterceptor('image'))
    async setCarouselImage(@Param('type') type: string, @Body() data: CreateLogoDto, @UploadedFile() file: any) {
        return this.logosService.setCarouselImage(file, type, data);
    }

    @Post('update-carousel-image-title-alt/:id/:type')
    @ApiOperation({ summary: 'Update carousel image title and alt' })
    @ApiParam({ name: 'id', required: true })
    @ApiParam({ name: 'type', required: true })
    @ApiBody({ type: UpdateCarouselImageTitleAltDto })
    async updateCarouselImageTitleAlt(@Param('id') id: string, @Body() data: UpdateCarouselImageTitleAltDto) {
        return this.logosService.updateCarouselImageTitleAlt({ params: { id }, body: data });
    }

    @Get('get-carousel/:type/:start/:limit')
    @ApiOperation({ summary: 'Get carousel images with pagination' })
    @ApiParam({ name: 'type', required: true })
    @ApiParam({ name: 'start', required: true })
    @ApiParam({ name: 'limit', required: true })
    async getCarousel(@Param('type') type: string, @Param('start') start: number, @Param('limit') limit: number) {
        return this.logosService.getCarousel(type, start, limit);
    }

    @Get('get-active-carousel/:type')
    @ApiOperation({ summary: 'Get active carousel images by type' })
    @ApiParam({ name: 'type', required: true })
    async getActiveCarousel(@Param('type') type: string) {
        return this.logosService.getActiveCarousel(type);
    }

    @Put('update-carousel-image/:id/:state')
    @ApiOperation({ summary: 'Update carousel image state' })
    @ApiParam({ name: 'id', required: true })
    @ApiParam({ name: 'state', required: true })
    async updateCarouselImage(@Param('id') id: string, @Param('state') state: string) {
        return this.logosService.updateCarouselImage(id, state);
    }

    @Delete('delete-carousel-image/:id')
    @ApiOperation({ summary: 'Delete a carousel image' })
    @ApiParam({ name: 'id', required: true })
    async deleteCarouselImage(@Param('id') id: string) {
        return this.logosService.deleteCarouselImage(id);
    }
}
