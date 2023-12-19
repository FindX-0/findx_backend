import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { EnvService } from '@config/env';

@Global()
@Module({
  providers: [
    {
      provide: Redis,
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        const redisInstance = new Redis({
          host: envService.get('REDIS_HOST'),
          port: envService.get('REDIS_PORT'),
          password: envService.get('REDIS_PASSWORD'),
        });

        redisInstance.on('error', (e) => {
          throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
      },
    },
  ],
  exports: [Redis],
})
export class RedisModule {}
