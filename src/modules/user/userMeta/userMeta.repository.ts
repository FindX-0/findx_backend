import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  NewUserMeta,
  SelectableUserMeta,
  UserMetaUpdate,
} from './userMeta.entity';

@Injectable()
export class UserMetaRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(params: NewUserMeta): Promise<SelectableUserMeta | null> {
    const entity = await this.db
      .insertInto('userMeta')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async getById(id: string): Promise<SelectableUserMeta | null> {
    const entity = await this.db
      .selectFrom('userMeta')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsById(id: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('userMeta')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('id', '=', id)
      .executeTakeFirst();

    const countStr = res?.count ?? '0';
    const count = parseInt(countStr as string);

    return count > 0;
  }

  async updateById(
    id: string,
    params: UserMetaUpdate,
  ): Promise<SelectableUserMeta | null> {
    const entity = await this.db
      .updateTable('userMeta')
      .set(params)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }
}