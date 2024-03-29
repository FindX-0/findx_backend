import { Injectable } from '@nestjs/common';
import { ExpressionBuilder } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  AnswerFunctionUpdate,
  NewAnswerFunction,
  SelectableAnswerFunction,
} from './answerFunction.entity';
import {
  FilterAnswerFunctionParams,
  GetAllAnswerFunctionParams,
} from './answerFunction.type';
import { DB } from '../../entities';

@Injectable()
export class AnswerFunctionRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    values: NewAnswerFunction,
  ): Promise<SelectableAnswerFunction | null> {
    const created = await this.db
      .insertInto('answerFunctions')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async updateById(
    id: string,
    values: AnswerFunctionUpdate,
  ): Promise<SelectableAnswerFunction | null> {
    const updated = await this.db
      .updateTable('answerFunctions')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async getById(id: string): Promise<SelectableAnswerFunction | null> {
    const entity = await this.db
      .selectFrom('answerFunctions')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('answerFunctions')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async filter({
    lastId,
    limit,
    mathSubFieldId,
  }: FilterAnswerFunctionParams): Promise<SelectableAnswerFunction[]> {
    const entities = await this.db
      .selectFrom('answerFunctions')
      .selectAll()
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .$if(Boolean(mathSubFieldId), (qb) =>
        qb.where('mathSubFieldId', '=', mathSubFieldId as string),
      )
      .select(this.withMathSubField)
      .orderBy('id desc')
      .limit(limit)
      .execute();

    return entities.map((entity) => {
      const mathSubField = entity.mathSubField
        ? {
            ...entity.mathSubField,
            createdAt: new Date(entity.mathSubField.createdAt),
          }
        : null;

      return { ...entity, mathSubField: mathSubField };
    });
  }

  async count({ mathSubFieldId }: FilterAnswerFunctionParams): Promise<number> {
    const countRes = await this.db
      .selectFrom('answerFunctions')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .$if(Boolean(mathSubFieldId), (qb) =>
        qb.where('mathSubFieldId', '=', mathSubFieldId as string),
      )
      .executeTakeFirst();

    const count = countRes?.count ?? '0';

    return parseInt(count as string);
  }

  async getAll({
    notIncludeId,
    mathSubFieldId,
  }: GetAllAnswerFunctionParams): Promise<SelectableAnswerFunction[]> {
    return this.db
      .selectFrom('answerFunctions')
      .$if(Boolean(notIncludeId), (qb) =>
        qb.where('id', '!=', notIncludeId as string),
      )
      .$if(Boolean(mathSubFieldId), (qb) =>
        qb.where('mathSubFieldId', '=', mathSubFieldId as string),
      )
      .selectAll()
      .execute();
  }

  private withMathSubField(eb: ExpressionBuilder<DB, 'answerFunctions'>) {
    return jsonObjectFrom(
      eb
        .selectFrom('mathSubFields')
        .selectAll()
        .whereRef('mathSubFields.id', '=', 'answerFunctions.mathSubFieldId'),
    ).as('mathSubField');
  }
}
