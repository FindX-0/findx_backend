import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';

import {
  NewUser,
  SelectableUser,
  SelectableUserOmitPassword,
  UserUpdate,
} from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async getByEmail(email: string): Promise<SelectableUser | null> {
    const entity = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('users')
      .where('email', '=', email)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    const countStr = res?.count ?? '0';
    const count = parseInt(countStr as string);

    return count > 0;
  }

  async createUser(params: NewUser): Promise<SelectableUser | null> {
    const entity = await this.db
      .insertInto('users')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async getById(id: string): Promise<SelectableUserOmitPassword | null> {
    const entity = await this.db
      .selectFrom('users')
      .where('id', '=', id)
      .select([
        'id',
        'createdAt',
        'userName',
        'email',
        'isCompleted',
        'authProvider',
      ])
      .executeTakeFirst();

    return entity ?? null;
  }

  async getIdByEmail(email: string): Promise<string | null> {
    const query = await this.db
      .selectFrom('users')
      .select('id')
      .where('email', '=', email)
      .executeTakeFirst();

    return query?.id ?? null;
  }

  async updatePasswordById(
    id: string,
    newPasswordHash: string,
  ): Promise<SelectableUser | null> {
    const entity = await this.db
      .updateTable('users')
      .set({ passwordHash: newPasswordHash })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsById(id: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('users')
      .where('id', '=', id)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    const countStr = res?.count ?? '0';
    const count = parseInt(countStr as string);

    return count > 0;
  }

  async updateById(
    id: string,
    params: UserUpdate,
  ): Promise<SelectableUser | null> {
    const entity = await this.db
      .updateTable('users')
      .where('id', '=', id)
      .set(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }
}
