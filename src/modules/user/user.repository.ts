import { Injectable } from '@nestjs/common';

import {
  NewUser,
  SelectableUser,
  SelectableUserOmitPassword,
  UserUpdate,
} from 'src/entities';

import { KyselyDB } from '../../config';
import { InjectKysely } from '../../packages/kyselyModule';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async getByEmail(email: string): Promise<SelectableUser | null> {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('users')
      .where('email', '=', email)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    return res?.count && res.count > 0;
  }

  async createUser(params: NewUser): Promise<SelectableUser> {
    return this.db
      .insertInto('users')
      .values(params)
      .returningAll()
      .executeTakeFirst();
  }

  async getById(id: string): Promise<SelectableUserOmitPassword | null> {
    return this.db
      .selectFrom('users')
      .where('id', '=', id)
      .select(['id', 'createdAt', 'userName', 'email', 'gender'])
      .executeTakeFirst();
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
    return this.db
      .updateTable('users')
      .set({ passwordHash: newPasswordHash })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async existsById(id: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('users')
      .where('id', '=', id)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    return res?.count && res.count > 0;
  }

  async updateById(
    id: string,
    params: UserUpdate,
  ): Promise<SelectableUser | null> {
    return this.db
      .updateTable('users')
      .where('id', '=', id)
      .set(params)
      .returningAll()
      .executeTakeFirst();
  }
}
