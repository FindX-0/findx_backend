import { Global, Injectable, Module } from '@nestjs/common';
import { Transaction } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

import { DB } from '@entities/index';

import { KyselyDB } from '../../config/database/kyselyDb.type';

export interface TransactionProvider {
  get(): Transaction<DB>;
}

@Injectable()
export class TransactionRunner {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async runTransaction<T>(
    callback: (txProvider: TransactionProvider) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction().execute((tx) =>
      callback({
        get: () => tx,
      }),
    );
  }
}

@Global()
@Module({
  providers: [TransactionRunner],
  exports: [TransactionRunner],
})
export class TransactionRunnerModule {}
