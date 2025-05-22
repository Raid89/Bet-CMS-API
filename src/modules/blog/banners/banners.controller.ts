import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
  import { BannersService } from './banners.service';
  import { CreateBannerDto, UpdateBannerDto } from './dto/banners.dto';
  
  @ApiTags('Banners')
  @Controller('banners')
  export class BannersController {
    constructor(private readonly bannersService: BannersService) {}
  
    @Get('get-banners')
    async findAll() {
      return this.bannersService.findAll();
    }
  
    @Get('get-banners-cms/:skip/:limit')
    async findAllCms(@Param('limit') limit: number, @Param('skip') skip: number) {
      return this.bannersService.findAllCms(limit, skip);
    }
  
    @Post('new-banner')
    @ApiSecurity('bearer')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() dto: CreateBannerDto,
      @UploadedFile() image: any
    ) {
      return this.bannersService.create(dto, image.buffer);
    }
  
    @Put('update-banner')
    @ApiSecurity('bearer')
    async update(@Body() dto: UpdateBannerDto, @Param('id') id: string) {
      return this.bannersService.update(id, dto);
    }
  
    @Put('activate-banner/:id')
    async activate(@Param('id') id: string) {
      return this.bannersService.activate(id);
    }
  
    @Put('inactivate-banner/:id')
    async inactivate(@Param('id') id: string) {
      return this.bannersService.inactivate(id);
    }
  
    @Delete('remove-banner/:id')
    @ApiSecurity('bearer')
    async remove(@Param('id') id: string) {
      return this.bannersService.remove(id);
    }
  }