import { promises as fs } from 'fs';
import * as path from 'path';

import {
  FileMigrationProvider,
  Kysely,
  MigrationResultSet,
  Migrator,
  PostgresDialect,
} from 'kysely';

import { DB } from 'src/entities';

import { createPostgresPool } from '../config';

export const createDatabase = (): Kysely<any> => {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: createPostgresPool(),
    }),
  });
};

export const createDatabaseMigrator = (db: Kysely<any>): Migrator => {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: __dirname,
    }),
  });
};

export const handleMigrationResultSet = ({
  error,
  results,
}: MigrationResultSet): void => {
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
};
