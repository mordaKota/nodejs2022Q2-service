import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const root = dirname(__dirname);
  const doc = await readFile(join(root, 'doc', 'api.yaml'), 'utf-8');
  SwaggerModule.setup('doc', app, parse(doc));
  await app.listen(4000);
}

bootstrap();
