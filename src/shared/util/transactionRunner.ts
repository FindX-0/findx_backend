import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';

import { KyselyDB } from '@config/database';
import { DB } from '@entities/entityTypes';
import { InjectKysely } from '@packages/kyselyModule';

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
