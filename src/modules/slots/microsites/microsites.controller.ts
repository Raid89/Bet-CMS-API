import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MicrositesService } from './microsites.service';
import { CreateMicrositeDto } from './dto/create-microsite.dto';
import { UpdateMicrositeDto } from './dto/update-microsite.dto';

@Controller('microsites')
export class MicrositesController {
  constructor(private readonly micrositesService: MicrositesService) {}

  @Post()
  create(@Body() createMicrositeDto: CreateMicrositeDto) {
    return this.micrositesService.create(createMicrositeDto);
  }

  @Get()
  findAll() {
    return this.micrositesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.micrositesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMicrositeDto: UpdateMicrositeDto) {
    return this.micrositesService.update(+id, updateMicrositeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.micrositesService.remove(+id);
  }
}
