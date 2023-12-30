import { Pool } from 'pg';

import { EnvService } from '../env/env.service';

export type PostgresPoolFactory = (envService: EnvService) => Pool;

export const createPostgresPool: PostgresPoolFactory = (envService) => {
  return new Pool({
    port: envService.get('DATABASE_PORT'),
    host: envService.get('DATABASE_HOST'),
    user: envService.get('DATABASE_USER'),
    password: envService.get('DATABASE_PASSWORD'),
    database: envService.get('DATABASE_NAME'),
  });
};
