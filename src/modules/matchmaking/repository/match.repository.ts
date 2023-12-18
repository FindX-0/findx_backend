import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { MatchState } from '@entities/entityEnums';
import { TransactionProvider } from '@shared/util';

import { NewMatch, SelectableMatch } from '../entity/match.entity';

@Injectable()
export class MatchRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    params: NewMatch,
    txProvider?: TransactionProvider,
  ): Promise<SelectableMatch | null> {
    const entity = await (txProvider?.get() ?? this.db)
      .insertInto('matches')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async updateStateById(
    id: string,
    state: MatchState,
    txProvider?: TransactionProvider,
  ): Promise<void> {
    await (txProvider?.get() ?? this.db)
      .updateTable('matches')
      .set({ state })
      .where('id', '=', id)
      .execute();
  }
}
