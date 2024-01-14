import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { EnvService } from '../env/env.service';

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
          maxRetriesPerRequest: 1000,
        });

        redisInstance.on('error', (e) => {
          console.error(e);
        });

        return redisInstance;
      },
    },
  ],
  exports: [Redis],
})
export class RedisModule {}
