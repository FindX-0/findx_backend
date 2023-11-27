import multiPart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { registerGqlEnums } from '@config/gql';

import { AppModule } from './app.module';

async function bootstrap() {
  const _100Mb = 1024 * 1024 * 100;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: _100Mb,
    }),
  );

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
}

bootstrap();
