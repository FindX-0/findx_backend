import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { MatchState } from '@entities/index';
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

  async getMathProblemIdsById(id: string): Promise<string[] | null> {
    const entity = await this.db
      .selectFrom('matches')
      .select(['id', 'mathProblemIds'])
      .where('id', '=', id)
      .executeTakeFirst();

    return entity?.mathProblemIds ?? null;
  }

  async getById(id: string): Promise<SelectableMatch | null> {
    const entity = await this.db
      .selectFrom('matches')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return entity ?? null;
  }
}
