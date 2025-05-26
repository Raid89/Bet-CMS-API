import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request } from 'express';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'] // Solo errores y warnings
  });
  const configService = app.get(ConfigService);
  const allowed_origins = configService.get('ALLOWED_ORIGINS');
  const allowed_headers = configService.get('ALLOWED_HEADERS').split(',').map((header: string) => header.trim());
  if (!allowed_headers.includes('Authorization')) {
    allowed_headers.push('Authorization');
  }

  if (configService.get('SECURE_DEPLOYMENT') === true) {
    const httpsOptions = {
      key: fs.readFileSync(configService.get('SSL_KEY_PATH') || ''),
      cert: fs.readFileSync(configService.get('SSL_CERT_PATH') || ''),
    };

    if (httpsOptions.key && httpsOptions.cert) {
      app = await NestFactory.create(AppModule, { httpsOptions });
    }
  }

  app.setGlobalPrefix("api/v1");
  console.log(`origin: ${allowed_origins[0] === '*' ? '*' : allowed_origins}`);
  console.log(`headers: ${allowed_headers === '*' ? '*' : allowed_headers}`);


  app.enableCors({
    origin: allowed_origins[0] === '*' ? '*' : allowed_origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: allowed_headers,
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const swaggerConfig = {
    title: configService.get('SWAGGER_TITLE'),
    description: configService.get('SWAGGER_DESCRIPTION'),
    version: configService.get('SWAGGER_VERSION'),
    path: configService.get('SWAGGER_PATH')
  }

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConfig.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      operationsSorter: 'method',
      displayRequestDuration: true,
      layout: 'StandaloneLayout',
    },
  });

  // Configuración de logger global
  const logger = new Logger();
  app.useLogger(logger);

  const port = configService.get('API_PORT');

  await app.listen(port);
  console.log(`Aplicación corriendo en: ${port}`);

}

bootstrap();