import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { MatchState } from '@entities/entityEnums';
import { DB } from '@entities/entityTypes';
import { NewMatch, SelectableMatch } from '@entities/match.entity';

@Injectable()
export class MatchRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    params: NewMatch,
    tx?: Transaction<DB>,
  ): Promise<SelectableMatch | null> {
    const entity = await (tx ?? this.db)
      .insertInto('matches')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async updateStateById(
    id: string,
    state: MatchState,
    tx?: Transaction<DB>,
  ): Promise<void> {
    await (tx ?? this.db)
      .updateTable('matches')
      .set({ state })
      .where('id', '=', id)
      .execute();
  }
}
