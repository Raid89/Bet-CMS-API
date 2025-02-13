import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MicrositesService } from './microsites.service';
import { CreateMicrositeDto } from './dto/create-microsite.dto';
import { UpdateMicrositeDto } from './dto/update-microsite.dto';

@Controller('')
export class MicrositesController {
  constructor(private readonly micrositesService: MicrositesService) {}
  
}
