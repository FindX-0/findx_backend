import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  NewMathBattleResult,
  SelectableMathBattleResult,
} from './mathBattleResult.entity';
import { TransactionProvider } from '../../shared/util';

@Injectable()
export class MathBattleResultRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    values: NewMathBattleResult,
    txProvider?: TransactionProvider,
  ): Promise<SelectableMathBattleResult | null> {
    const created = await (txProvider?.get() ?? this.db)
      .insertInto('mathBattleResults')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async getAllByMatchId(
    matchId: string,
  ): Promise<SelectableMathBattleResult[]> {
    return this.db
      .selectFrom('mathBattleResults')
      .selectAll()
      .where('matchId', '=', matchId)
      .execute();
  }
}
