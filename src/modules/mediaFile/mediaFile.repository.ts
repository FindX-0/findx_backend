import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { TransactionProvider } from '@shared/util';

import { NewMediaFile, SelectableMediaFile } from './mediaFile.entity';

@Injectable()
export class MediaFileRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewMediaFile): Promise<SelectableMediaFile | null> {
    const entity = await this.db
      .insertInto('mediaFiles')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async createMany(values: NewMediaFile[]): Promise<SelectableMediaFile[]> {
    return this.db
      .insertInto('mediaFiles')
      .values(values)
      .returningAll()
      .execute();
  }

  async deleteById(
    id: string,
    txProvider?: TransactionProvider,
  ): Promise<boolean> {
    const deleteResults = await (txProvider?.get() ?? this.db)
      .deleteFrom('mediaFiles')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }

  async deleteManyByIds(
    ids: string[],
    txProvider?: TransactionProvider,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }

    await (txProvider?.get() ?? this.db)
      .deleteFrom('mediaFiles')
      .where('id', 'in', ids)
      .execute();
  }

  async getById(id: string): Promise<SelectableMediaFile | null> {
    const entity = await this.db
      .selectFrom('mediaFiles')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return entity ?? null;
  }

  async getByIds(ids: string[]): Promise<SelectableMediaFile[]> {
    if (!ids.length) {
      return [];
    }

    return this.db
      .selectFrom('mediaFiles')
      .selectAll()
      .where('id', 'in', ids)
      .execute();
  }

  async countByIds(ids: string[]): Promise<number> {
    if (!ids.length) {
      return 0;
    }

    const countRes = await this.db
      .selectFrom('mediaFiles')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('id', 'in', ids)
      .executeTakeFirst();

    const count = countRes?.count ?? '0';

    return parseInt(count as string);
  }
}
