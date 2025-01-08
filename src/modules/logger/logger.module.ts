import { Module } from '@nestjs/common';
import { NextLoggerService } from './logger.service';

@Module({
  providers: [NextLoggerService],
  exports: [NextLoggerService],
})
export class LoggerModule {}
