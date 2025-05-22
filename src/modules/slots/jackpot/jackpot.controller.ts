import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JackpotService } from './jackpot.service';
import { CreateJackpotDto } from './dto/create-jackpot.dto';
import { UpdateJackpotDto } from './dto/update-jackpot.dto';

@Controller('jackpot')
export class JackpotController {
  constructor(private readonly jackpotService: JackpotService) {}

  @Post()
  create(@Body() createJackpotDto: CreateJackpotDto) {
    return this.jackpotService.create(createJackpotDto);
  }

  @Get()
  findAll() {
    return this.jackpotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jackpotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJackpotDto: UpdateJackpotDto) {
    return this.jackpotService.update(+id, updateJackpotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jackpotService.remove(+id);
  }
}
