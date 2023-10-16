import { KyselyConfig, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import {
  createAsyncOptionsProvider,
  createAsyncProviders,
} from './kysely.provider-factory';
import { KYSELY_MODULE_OPTIONS_TOKEN } from '../constants';
import { KyselyModuleAsyncOptions } from '../kysely.interfaces';

describe('Kysely provider factory', () => {
  const useFactory = (): KyselyConfig => ({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'kysely_test',
      }),
    }),
  });

  test('should get async provider', () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory };

    expect(createAsyncProviders(kyselyModuleAsyncOptions)).toStrictEqual([
      {
        inject: undefined,
        provide: KYSELY_MODULE_OPTIONS_TOKEN,
        useFactory,
      },
    ]);
  });

  test('should get options provider', () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory };

    expect(createAsyncOptionsProvider(kyselyModuleAsyncOptions)).toStrictEqual({
      inject: undefined,
      provide: KYSELY_MODULE_OPTIONS_TOKEN,
      useFactory,
    });
  });
});
