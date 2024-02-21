import { Injectable } from '@nestjs/common';
import { ExpressionBuilder } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';
import { DB } from '@entities/index';

import {
  MathSubFieldUpdate,
  NewMathSubField,
  SelectableMathSubField,
  SelectableMathSubFieldWithRelations,
} from './mathSubField.entity';
import {
  CountMathSubFieldParams,
  FilterMathSubFieldParams,
} from './mathSubField.type';

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

  async getById(
    id: string,
  ): Promise<SelectableMathSubFieldWithRelations | null> {
    const entity = await this.db
      .selectFrom('mathSubFields')
      .where('id', '=', id)
      .select((eb) => [this.withMathField(eb)])
      .selectAll()
      .executeTakeFirst();

    const mathField = entity?.mathField
      ? {
          ...entity.mathField,
          createdAt: new Date(entity.mathField.createdAt),
        }
      : null;

    return entity ? { ...entity, mathField } : null;
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
  }: FilterMathSubFieldParams): Promise<SelectableMathSubFieldWithRelations[]> {
    const mathSubFields = await this.db
      .selectFrom('mathSubFields')
      .selectAll('mathSubFields')
      .select((eb) => [this.withMathField(eb)])
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .$if(Boolean(mathFieldId), (qb) =>
        qb.where('mathFieldId', '=', mathFieldId as string),
      )
      .orderBy('mathSubFields.id desc')
      .limit(limit)
      .execute();

    return mathSubFields.map((mathSubField) => {
      return {
        ...mathSubField,
        mathField: mathSubField.mathField
          ? {
              ...mathSubField.mathField,
              createdAt: new Date(mathSubField.mathField.createdAt),
            }
          : null,
      };
    });
  }

  async count({ mathFieldId }: CountMathSubFieldParams): Promise<number> {
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

  async getAllIds(): Promise<string[]> {
    const res = await this.db
      .selectFrom('mathSubFields')
      .select(['id'])
      .execute();

    return res.map((e) => e.id);
  }

  async getAllIdsByMathFieldId(mathFieldId: string): Promise<string[]> {
    const res = await this.db
      .selectFrom('mathSubFields')
      .select(['id'])
      .where('mathFieldId', '=', mathFieldId)
      .execute();

    return res.map((e) => e.id);
  }

  private withMathField(eb: ExpressionBuilder<DB, 'mathSubFields'>) {
    return jsonObjectFrom(
      eb
        .selectFrom('mathFields')
        .selectAll()
        .whereRef('mathFields.id', '=', 'mathSubFields.mathFieldId'),
    ).as('mathField');
  }
}
