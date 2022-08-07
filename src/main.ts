import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: console,
  });

  const configService = app.get(ConfigService);
  app.useLogger(new LoggerService());

  app.useGlobalPipes(new ValidationPipe());
  const doc = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  SwaggerModule.setup('doc', app, parse(doc));
  await app.listen(PORT);
}

bootstrap();
