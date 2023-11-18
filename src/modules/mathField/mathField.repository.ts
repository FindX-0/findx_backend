import { Injectable } from '@nestjs/common';

import { KyselyDB } from '@config/database';
import {
  MathFieldUpdate,
  NewMathField,
  SelectableMathField,
} from '@entities/mathField.entity';
import { InjectKysely } from '@packages/kyselyModule';

@Injectable()
export class MathFieldRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewMathField): Promise<SelectableMathField> {
    return this.db
      .insertInto('mathFields')
      .values(values)
      .returningAll()
      .executeTakeFirst();
  }

  async updateById(
    id: string,
    values: MathFieldUpdate,
  ): Promise<SelectableMathField> {
    return this.db
      .updateTable('mathFields')
      .where('id', '=', id)
      .set(values)
      .returningAll()
      .executeTakeFirst();
  }

  async getById(id: string): Promise<SelectableMathField | null> {
    return this.db
      .selectFrom('mathFields')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('mathFields')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }
}
