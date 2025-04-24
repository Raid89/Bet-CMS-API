import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePathDto, UpdatePathDto } from './dto/paths.dto';
import { PathsService } from './paths.service';

@ApiTags('Parametrización - Rutas')
@Controller('parameterize')
export class PathsController {

    constructor(
        private pathsService: PathsService,
    ){}

    @Get('paths')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener todas las rutas' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Rutas obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las rutas' })
    @HttpCode(HttpStatus.OK)
    async getAllPaths(){
            return await this.pathsService.getAllPaths();
    }

    @Get('path/:id')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener una ruta por id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Rutas obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las rutas' })
    @HttpCode(HttpStatus.OK)
    async getPathById( @Param('id') id: string){
            return await this.pathsService.getPathById(id);
    }

    @Get('active-paths')
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Obtener todas las rutas activas' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Rutas obtenidas correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al obtener las rutas' })
    @HttpCode(HttpStatus.OK)
    async getActivePaths(){
            return await this.pathsService.getActivePaths();
    }

    @Post('paths')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Agregar una ruta' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Ruta agregada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al agregar la ruta' })
    @HttpCode(HttpStatus.CREATED)
    async createPromo(@Body() pathData: CreatePathDto){
        return await this.pathsService.createPath(pathData);
    }
    
    @Put('paths/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Agregar una ruta' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Ruta editada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al editar la ruta' })
    @HttpCode(HttpStatus.CREATED)
    async updatePromo(@Body() pathData: UpdatePathDto, @Param('id') id: string){
        return await this.pathsService.updatePath(id, pathData);
    }
    
    @Delete('paths/:id')
    @ApiSecurity('bearer')
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Agregar una ruta' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Ruta eliminada correctamente' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Ha ocurrido un error al eliminar la ruta' })
    @HttpCode(HttpStatus.CREATED)
    async deletePath(@Param('id') id: string){
        return await this.pathsService.deletePath(id);
    }
}