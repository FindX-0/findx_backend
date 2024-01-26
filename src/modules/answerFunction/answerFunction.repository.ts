import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';
import { LastIdPageParams } from '@shared/type';

import {
  AnswerFunctionUpdate,
  NewAnswerFunction,
  SelectableAnswerFunction,
} from './answerFunction.entity';
import {
  FilterAnswerFunctionParams,
  GetAllAnswerFunctionParams,
} from './answerFunction.type';
import { NumberType } from '../../entities';

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
    numberType,
  }: FilterAnswerFunctionParams): Promise<SelectableAnswerFunction[]> {
    return this.db
      .selectFrom('answerFunctions')
      .selectAll()
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .$if(Boolean(numberType), (qb) =>
        qb.where('numberType', '=', numberType as NumberType),
      )
      .orderBy('id desc')
      .limit(limit)
      .execute();
  }

  async count({ numberType }: FilterAnswerFunctionParams): Promise<number> {
    const countRes = await this.db
      .selectFrom('answerFunctions')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .$if(Boolean(numberType), (qb) =>
        qb.where('numberType', '=', numberType as NumberType),
      )
      .executeTakeFirst();

    const count = countRes?.count ?? '0';

    return parseInt(count as string);
  }

  async getAll({
    notIncludeId,
    numberType,
  }: GetAllAnswerFunctionParams): Promise<SelectableAnswerFunction[]> {
    return this.db
      .selectFrom('answerFunctions')
      .$if(Boolean(notIncludeId), (qb) =>
        qb.where('id', '!=', notIncludeId as string),
      )
      .$if(Boolean(numberType), (qb) =>
        qb.where('numberType', '==', numberType as NumberType),
      )
      .selectAll()
      .execute();
  }
}
