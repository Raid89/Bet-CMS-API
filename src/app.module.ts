import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { EnvConfiguration } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './modules/logger/logger.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppearanceModule } from './modules/appearance/appearance.module';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PromotionsModule } from "./modules/promotions/promotions.module";
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load : [ EnvConfiguration ],
      validationSchema: envValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../uploads'), // Ruta a la carpeta uploads fuera del proyecto
      serveRoot: '', // Ruta base para servir los archivos
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    AuthModule,
    RoleModule,
    AppearanceModule,
    ApplicationsModule,
    PromotionsModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
