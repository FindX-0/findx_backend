import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';

import {
  MathSubFieldUpdate,
  NewMathSubField,
  SelectableMathSubField,
} from './mathSubField.entity';
import { FilterMathSubFieldParams } from './mathSubField.type';

@Injectable()
export class MathSubFieldRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    values: NewMathSubField,
  ): Promise<SelectableMathSubField | null> {
    const created = await this.db
      .insertInto('mathSubFields')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async updateById(
    id: string,
    values: MathSubFieldUpdate,
  ): Promise<SelectableMathSubField | null> {
    const updated = await this.db
      .updateTable('mathSubFields')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async getById(id: string): Promise<SelectableMathSubField | null> {
    const entity = await this.db
      .selectFrom('mathSubFields')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('mathSubFields')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async filter({
    lastId,
    limit,
    mathFieldId,
  }: FilterMathSubFieldParams): Promise<SelectableMathSubField[]> {
    return this.db
      .selectFrom('mathSubFields')
      .selectAll()
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .$if(Boolean(mathFieldId), (qb) =>
        qb.where('mathFieldId', '=', mathFieldId as string),
      )
      .orderBy('id desc')
      .limit(limit)
      .execute();
  }

  async count({ mathFieldId }: FilterMathSubFieldParams): Promise<number> {
    const countRes = await this.db
      .selectFrom('mathSubFields')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .$if(Boolean(mathFieldId), (qb) =>
        qb.where('mathFieldId', '=', mathFieldId as string),
      )
      .executeTakeFirst();

    const count = countRes?.count ?? '0';

    return parseInt(count as string);
  }
}
