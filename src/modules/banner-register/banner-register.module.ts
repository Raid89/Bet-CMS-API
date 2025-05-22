import { Module } from '@nestjs/common';
import { BannerRegisterController } from './banner-register.controller';

@Module({
  controllers: [BannerRegisterController]
})
export class BannerRegisterModule {}
