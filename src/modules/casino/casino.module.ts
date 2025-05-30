import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CasinoLiveController } from './games/casino-live.controller';
import { CasinoLiveService } from './games/casino-live.service';
import { CasinoLive, CasinoLiveSchema } from './schemas/casino-live.schema';
import { FileStorageService } from '../../common/file-storage.service';

@Module({
  imports: [
    ConfigModule, // Importar ConfigModule para que ConfigService esté disponible
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: CasinoLive.name, schema: CasinoLiveSchema }
    ])
  ],
  controllers: [CasinoLiveController],
  providers: [CasinoLiveService, FileStorageService],
  exports: [CasinoLiveService]
})
export class CasinoModule {}