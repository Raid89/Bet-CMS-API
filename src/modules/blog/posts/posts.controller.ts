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
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiConsumes } from '@nestjs/swagger';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dto/posts.dto';
  import { UpdatePostDto } from './dto/posts.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @ApiTags('Posts')
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @Get('get-all/:limit/:skip')
    @ApiOperation({ summary: 'Obtener todos los posts paginados' })
    async findAll(@Param('limit') limit: number, @Param('skip') skip: number) {
      return this.postsService.findAll(limit, skip);
    }
  
    @Get('get-single-post/:id')
    @ApiOperation({ summary: 'Obtener un post por ID' })
    async findOne(@Param('id') id: string) {
      return this.postsService.findOne(id);
    }
  
    @Get('new-get-single-post/:title')
    @ApiOperation({ summary: 'Obtener un post por título formateado' })
    async findByFormattedTitle(@Param('title') title: string) {
      return this.postsService.findByFormattedTitle(title);
    }
  
    @Post('new-post')
    @ApiSecurity('bearer')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Crear un nuevo post' })
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() createDto: CreatePostDto,
      @Req() req: any,
      @UploadedFile() image: any
    ) {
      return this.postsService.create(createDto, req.user._id, image?.buffer);
    }
  
    @Post('update-single-post/:id')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Actualizar un post por ID' })
    async update(@Param('id') id: string, @Body() updateDto: UpdatePostDto) {
      return this.postsService.update(id, updateDto);
    }
  
    @Post('remove-post/:id')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Eliminar un post por ID' })
    async remove(@Param('id') id: string) {
      return this.postsService.remove(id);
    }
  }
  