import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
  import { VideosService } from './videos.service';
  import { CreateVideoDto, UpdateVideoDto } from './dto/videos.dto';
  
  @ApiTags('Videos')
  @Controller('videos')
  export class VideosController {
    constructor(private readonly videosService: VideosService) {}
  
    @Get('get-all/:limit/:skip')
    async findAll(@Param('limit') limit: number, @Param('skip') skip: number) {
      return this.videosService.findAll(limit, skip);
    }
  
    @Get('get-videos/:limit/:skip')
    async findActive(@Param('limit') limit: number, @Param('skip') skip: number) {
      return this.videosService.findActive(limit, skip);
    }
  
    @Get('get-single-video/:id')
    async findOne(@Param('id') id: string) {
      return this.videosService.findOne(id);
    }
  
    @Post('new-video')
    @ApiSecurity('bearer')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'preview', maxCount: 1 },
    ]))
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() dto: CreateVideoDto,
      @Req() req: any,
      @UploadedFiles() files: { file?: any; preview?: any }
    ) {
      return this.videosService.create(
        dto,
        req.user._id,
        files.file?.[0]?.buffer,
        files.preview?.[0]?.buffer
      );
    }
  
    @Post('update-video/:id')
    @ApiSecurity('bearer')
    async update(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
      return this.videosService.update(id, dto);
    }
  
    @Post('remove-video/:id')
    @ApiSecurity('bearer')
    async remove(@Param('id') id: string) {
      return this.videosService.remove(id);
    }
  }
  