import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import {
  NewUser,
  SelectableUser,
  PublicSelectableUser,
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

  async getByDeviceId(deviceId: string): Promise<SelectableUser | null> {
    const entity = await this.db
      .selectFrom('users')
      .selectAll()
      .where('deviceId', '=', deviceId)
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('users')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('email', '=', email)
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

  async getById(id: string): Promise<PublicSelectableUser | null> {
    const entity = await this.db
      .selectFrom('users')
      .select([
        'id',
        'createdAt',
        'userName',
        'email',
        'isCompleted',
        'authProvider',
        'isOnline',
        'deviceId',
      ])
      .where('id', '=', id)
      .executeTakeFirst();

    return entity ?? null;
  }

  async getIdByEmail(email: string): Promise<string | null> {
    const query = await this.db
      .selectFrom('users')
      .select(['id'])
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
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('id', '=', id)
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
      .set(params)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async updateIsOnlineById(id: string, isOnline: boolean): Promise<void> {
    await this.db
      .updateTable('users')
      .set({ isOnline })
      .where('id', '=', id)
      .execute();
  }

  async getSocketIdById(id: string): Promise<string | null> {
    const entity = await this.db
      .selectFrom('users')
      .select(['id', 'socketId'])
      .where('id', '=', id)
      .executeTakeFirst();

    return entity?.socketId ?? null;
  }

  async getSocketIds(userIds: string[]): Promise<string[]> {
    if (!userIds.length) {
      return [];
    }

    const entities = await this.db
      .selectFrom('users')
      .where('id', 'in', userIds)
      .select(['id', 'socketId'])
      .execute();

    return entities.map((e) => e.socketId);
  }
}
