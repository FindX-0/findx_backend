import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';

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
      .insertInto('MathBattleAnswer')
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
      .updateTable('MathBattleAnswer')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('MathBattleAnswer')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }
}
