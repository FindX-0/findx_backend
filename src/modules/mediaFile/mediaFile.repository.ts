import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { NewMediaFile, SelectableMediaFile } from '@entities/mediaFile.entity';

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

  async deleteById(id: string): Promise<boolean> {
    const deleteResults = await this.db
      .deleteFrom('mediaFiles')
      .where('id', '=', id)
      .execute();

    return Boolean(deleteResults.length);
  }
}
