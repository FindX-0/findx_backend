import { Injectable } from '@nestjs/common';
import { ExpressionBuilder } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { DB } from '@entities/entityTypes';
import { TransactionProvider } from '@shared/util';

import {
  MathProblemUpdate,
  NewMathProblem,
  SelectableMathProblem,
} from '../mathProblem.entity';
import {
  CountMathProblemParams,
  FilterMathProblemParams,
} from '../mathProblem.type';

@Injectable()
export class MathProblemRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewMathProblem): Promise<SelectableMathProblem | null> {
    const created = await this.db
      .insertInto('mathProblems')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return created ?? null;
  }

  async updateById(
    id: string,
    values: MathProblemUpdate,
    txProvider?: TransactionProvider,
  ): Promise<SelectableMathProblem | null> {
    const updated = await (txProvider?.get() ?? this.db)
      .updateTable('mathProblems')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return updated ?? null;
  }

  async getById(id: string): Promise<SelectableMathProblem | null> {
    const entity = await this.db
      .selectFrom('mathProblems')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async getImageMediaIdsById(id: string): Promise<string[] | null> {
    const entity = await this.db
      .selectFrom('mathProblems')
      .select(['id', 'imageMediaIds'])
      .where('id', '=', id)
      .executeTakeFirst();

    return entity?.imageMediaIds ?? null;
  }

  async deleteById(
    id: string,
    txProvider?: TransactionProvider,
  ): Promise<boolean> {
    const deleteResults = await (txProvider?.get() ?? this.db)
      .deleteFrom('mathProblems')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async filter({
    lastId,
    limit,
    mathFieldId,
    mathSubFieldId,
  }: FilterMathProblemParams): Promise<SelectableMathProblem[]> {
    const mathProblems = await this.db
      .selectFrom('mathProblems')
      .selectAll('mathProblems')
      .select((eb) => [this.withMathField(eb), this.withMathSubField(eb)])
      .$if(Boolean(lastId), (qb) => qb.where('id', '<', lastId as string))
      .$if(Boolean(mathFieldId), (qb) =>
        qb.where('mathFieldId', '=', mathFieldId as string),
      )
      .$if(Boolean(mathSubFieldId), (qb) =>
        qb.where('mathSubFieldId', '=', mathSubFieldId as string),
      )
      .orderBy('id desc')
      .limit(limit)
      .execute();

    return mathProblems.map((mathProblem) => {
      return {
        ...mathProblem,
        mathField: mathProblem.mathField
          ? {
              ...mathProblem.mathField,
              createdAt: new Date(mathProblem.mathField.createdAt),
            }
          : null,
        mathSubField: mathProblem.mathSubField
          ? {
              ...mathProblem.mathSubField,
              createdAt: new Date(mathProblem.mathSubField.createdAt),
            }
          : null,
      };
    });
  }

  async count({
    mathFieldId,
    mathSubFieldId,
  }: CountMathProblemParams): Promise<number> {
    const countRes = await this.db
      .selectFrom('mathProblems')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .$if(Boolean(mathFieldId), (qb) =>
        qb.where('mathFieldId', '=', mathFieldId as string),
      )
      .$if(Boolean(mathSubFieldId), (qb) =>
        qb.where('mathSubFieldId', '=', mathSubFieldId as string),
      )
      .executeTakeFirst();

    const count = countRes?.count ?? '0';

    return parseInt(count as string);
  }

  private withMathField(eb: ExpressionBuilder<DB, 'mathProblems'>) {
    return jsonObjectFrom(
      eb
        .selectFrom('mathFields')
        .selectAll()
        .whereRef('mathFields.id', '=', 'mathProblems.mathFieldId'),
    ).as('mathField');
  }

  private withMathSubField(eb: ExpressionBuilder<DB, 'mathProblems'>) {
    return jsonObjectFrom(
      eb
        .selectFrom('mathSubFields')
        .selectAll()
        .whereRef('mathSubFields.id', '=', 'mathProblems.mathSubFieldId'),
    ).as('mathSubField');
  }
}
