import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity, ApiConsumes } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { Request } from 'express';
import { AuthGuard } from '../../../guards/auth.guard';

@ApiTags('Slots - Banner')
@Controller('slots')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @Post('banners/new-banner')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Crear nuevo banner de slots' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  addSlotBanner(@UploadedFiles() files: any, @Req() req: Request) {
    const filesObject: any = {};
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        filesObject[file.fieldname] = file;
      });
    }
    return this.bannerService.addSlotBanner({ files: filesObject, body: req.body });
  }

  @Get('banners/get-banners')
  @ApiOperation({ summary: 'Obtener todos los banners de slots' })
  getSlotBanners() {
    return this.bannerService.getSlotBanners();
  }
  @Post('banners/remove-banner/:id')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Eliminar banner de slots por ID' })
  removeSlotBanner(@Param('id') id: string) {
    return this.bannerService.removeSlotBanner(id);
  }
}
