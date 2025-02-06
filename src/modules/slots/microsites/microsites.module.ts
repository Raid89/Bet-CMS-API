import { Module } from '@nestjs/common';
import { MicrositesService } from './microsites.service';
import { MicrositesController } from './microsites.controller';
import { FileStorageService } from 'src/common/file-storage.service';

@Module({
  controllers: [MicrositesController],
  providers: [MicrositesService, FileStorageService],
  exports: [MicrositesService],
})
export class MicrositesModule {}
