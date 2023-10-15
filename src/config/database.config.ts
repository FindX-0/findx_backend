import { Kysely } from 'kysely';
import { DB } from '../entities';
import { Pool } from 'pg';

export type KyselyDB = Kysely<DB>;

export type PostgresPoolFactory = () => Pool;

export const createPostgresPool: PostgresPoolFactory = () => {
  return new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: '12345',
    database: 'math',
  });
};
