import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './logger/all-exception.filter';

const PORT = process.env.PORT || 4000;

process
  .on('uncaughtException', (err) => {
    Logger.error(
      `Uncaught exception: ${err.message}`,
      err.stack,
      'UncaughtException',
    );
  })
  .on('unhandledRejection', (reason, promise) => {
    Logger.error(
      `Unhandled rejection at: ${promise}, reason: ${reason}`,
      'UnhandledRejection',
    );
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(new LoggerService());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  const doc = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  SwaggerModule.setup('doc', app, parse(doc));
  await app.listen(PORT);
}

bootstrap();
