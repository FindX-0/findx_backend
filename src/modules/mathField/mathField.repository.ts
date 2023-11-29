import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { LastIdPageParams } from '@shared/type';

import {
  MathFieldUpdate,
  NewMathField,
  SelectableMathField,
} from './mathField.entity';

@Injectable()
export class MathFieldRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewMathField): Promise<SelectableMathField | null> {
    const created = await this.db
      .insertInto('mathFields')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async updateById(
    id: string,
    values: MathFieldUpdate,
  ): Promise<SelectableMathField | null> {
    const updated = await this.db
      .updateTable('mathFields')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async getById(id: string): Promise<SelectableMathField | null> {
    const entity = await this.db
      .selectFrom('mathFields')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('mathFields')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async filter({
    lastId,
    limit,
  }: LastIdPageParams): Promise<SelectableMathField[]> {
    return this.db
      .selectFrom('mathFields')
      .selectAll()
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .orderBy('id desc')
      .limit(limit)
      .execute();
  }

  async count(): Promise<number> {
    const countRes = await this.db
      .selectFrom('mathFields')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    return countRes?.count ?? 0;
  }
}
