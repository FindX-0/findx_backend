import { Pool } from 'pg';

export type PostgresPoolFactory = () => Pool;

// TODO get from env
export const createPostgresPool: PostgresPoolFactory = () => {
  return new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: '12345',
    database: 'math',
  });
};
