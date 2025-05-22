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
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { ApiTags, ApiSecurity, ApiConsumes } from '@nestjs/swagger';
  import { BlogsService } from './blogs.service';
  import { BlogsDto } from './dto/blogs.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @ApiTags('Blogs')
  @Controller('blogs')
  export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}
  
    @Get('get-all/:limit/:skip')
    async findAll(@Param('limit') limit: number, @Param('skip') skip: number) {
      return this.blogsService.findAll(limit, skip);
    }
  
    @Get('get-single-blog/:id')
    async findOne(@Param('id') id: string) {
      return this.blogsService.findOne(id);
    }
  
    @Post('new-blog')
    @ApiSecurity('bearer')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: BlogsDto, @Req() req: any) {
      return this.blogsService.create(dto, req.user._id);
    }
  
    @Post('update-single-blog/:id')
    @ApiSecurity('bearer')
    async update(@Param('id') id: string, @Body() dto: Partial<BlogsDto>) {
      return this.blogsService.update(id, dto);
    }
  
    @Post('set-feature-image/:id')
    @ApiSecurity('bearer')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    async setFeatureImage(@Param('id') id: string, @UploadedFile() image: any) {
      return this.blogsService.setFeatureImage(id, image.buffer);
    }
  
    @Post('remove-blog/:id')
    @ApiSecurity('bearer')
    async remove(@Param('id') id: string) {
      return this.blogsService.remove(id);
    }
  }