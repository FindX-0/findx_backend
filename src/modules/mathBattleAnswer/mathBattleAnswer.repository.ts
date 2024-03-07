import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  MathBattleAnswerUpdate,
  NewMathBattleAnswer,
  SelectableMathBattleAnswer,
} from './mathBattleAnswer.entity';

@Injectable()
export class MathBattleAnswerRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    values: NewMathBattleAnswer,
  ): Promise<SelectableMathBattleAnswer | null> {
    const created = await this.db
      .insertInto('mathBattleAnswers')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async updateById(
    id: string,
    values: MathBattleAnswerUpdate,
  ): Promise<SelectableMathBattleAnswer | null> {
    const updated = await this.db
      .updateTable('mathBattleAnswers')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('mathBattleAnswers')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async getAllByMatchId(
    matchId: string,
  ): Promise<SelectableMathBattleAnswer[]> {
    return this.db
      .selectFrom('mathBattleAnswers')
      .selectAll()
      .where('matchId', '=', matchId)
      .execute();
  }

  async getLastByMatchIdAndUserId(
    matchId: string,
    userId: string,
  ): Promise<SelectableMathBattleAnswer | null> {
    const entity = await this.db
      .selectFrom('mathBattleAnswers')
      .selectAll()
      .where('matchId', '=', matchId)
      .where('userId', '=', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .executeTakeFirst();

    return entity ?? null;
  }
}
