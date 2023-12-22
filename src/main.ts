import { join } from 'path';

import multiPart from '@fastify/multipart';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { registerGqlEnums } from './config/gql';
import { DIRECTORY_UPLOADS } from './modules/mediaFile/mediaFile.constant';

async function bootstrap() {
  const _100Mb = 1024 * 1024 * 100;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: _100Mb,
    }),
  );

  app.useStaticAssets({
    root: join(__dirname, '..', DIRECTORY_UPLOADS),
    index: false,
    prefix: `/${DIRECTORY_UPLOADS}`,
  });

  registerGqlEnums();

  // comperssion might be usefull

  // app.set('trust proxy', 1);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.register(multiPart, {
    throwFileSizeLimit: true,
    limits: {
      files: 100,
      fileSize: _100Mb,
    },
  });

  await app.listen(3000, '0.0.0.0');

  const url = await app.getUrl();

  new Logger().log('Started running on ' + url);
}

bootstrap();
