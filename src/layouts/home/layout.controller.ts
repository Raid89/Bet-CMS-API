import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Layouts')
@Controller('layouts')
export class LayoutController { 
    constructor(private readonly LayoutService: LayoutService) {}

    @Get('get-all/:limit/:skip')
    async getAllLayouts(
        @Param('limit') limit: number,
        @Param('skip') skip: number
    ){
        return this.LayoutService.getAllLayouts(limit, skip);
    }

    @Get('get-single-layout/:id')
    async getSingleLayout(
        @Param('id') id: string
    ){}

    @Get('get-feature')
    async getFeatureLayout(){}

    @Post('new-layout')
    async createNewLayout(@Body() dataLayout: CreateLayoutDto){}

    @Post('update-single-layout/:id')
    async updateSingleLayout(
        @Param('id') id: string,
        @Body() dataLayout: UpdateLayoutDto
    ){}

    @Post('remove-layout/:id')
    async removeLayout(
        @Param('id') id: string
    ){}

    @Post('set-feature/:id')
    async setFeatureLayout(
        @Param('id') id: string
    ){}
}