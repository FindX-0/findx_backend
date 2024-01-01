import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  NewMathBattleResult,
  SelectableMathBattleResult,
} from './mathBattleResult.entity';

@Injectable()
export class MathBattleResultRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    values: NewMathBattleResult,
  ): Promise<SelectableMathBattleResult | null> {
    const created = await this.db
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
