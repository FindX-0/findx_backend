import { Kysely } from 'kysely';
import { User } from '../entities/user.entity';
import { Pool } from 'pg';

export interface Database {
  users: User;
}

export type DB = Kysely<Database>;

export type PostgresPoolFactory = () => Pool;

export const createPostgresPool: PostgresPoolFactory = () => {
  return new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: '12345',
    database: 'math',
  });
};
