import { Module } from '@nestjs/common';
import { MicrositesService } from './microsites.service';
import { MicrositesController } from './microsites.controller';

@Module({
  controllers: [MicrositesController],
  providers: [MicrositesService],
})
export class MicrositesModule {}
