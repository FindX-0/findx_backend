import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import {
  FriendUpdate,
  NewFriend,
  SelectableFriend,
  SelectableFriendWithRelations,
} from './friend.entity';
import { FilterAllFriendParams } from './friend.type';
import { KyselyDB } from '../../config/database/kyselyDb.type';

@Injectable()
export class FriendRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewFriend): Promise<SelectableFriend | null> {
    const entity = await this.db
      .insertInto('friends')
      .returningAll()
      .values(values)
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<boolean> {
    const res = await this.db
      .selectFrom('friends')
      .select(({ fn }) => [fn.count<number>('userId').as('count')])
      .where((eb) => eb.and({ userId, friendId }))
      .executeTakeFirst();

    const countStr = res?.count ?? '0';
    const count = parseInt(countStr as string);

    return count > 0;
  }

  async getByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<SelectableFriend | null> {
    const entity = await this.db
      .selectFrom('friends')
      .selectAll()
      .where((eb) => eb.and({ userId, friendId }))
      .executeTakeFirst();

    return entity ?? null;
  }

  async deleteByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<boolean> {
    const a = await this.db
      .deleteFrom('friends')
      .where((eb) => eb.and({ userId, friendId }))
      .execute();

    return a.length > 0;
  }

  async updateByUserIdAndFriendId(
    userId: string,
    friendId: string,
    values: FriendUpdate,
  ): Promise<SelectableFriend | null> {
    const entity = await this.db
      .updateTable('friends')
      .where((eb) => eb.and({ userId, friendId }))
      .set(values)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async getAll(
    params: FilterAllFriendParams,
  ): Promise<SelectableFriendWithRelations[]> {
    const { friendId, status, searchQuery } = params;

    const entities = await this.db
      .selectFrom('friends')
      .innerJoin('users', 'users.id', 'friends.userId')
      .select([
        'friends.createdAt',
        'friends.status',
        'friends.userId',
        'friends.friendId',
        'users.id as user_id',
        'users.email as user_email',
        'users.userName as user_name',
        'users.createdAt as user_createdAt',
        'users.isCompleted as user_isCompleted',
        'users.authProvider as user_authProvider',
      ])
      .where('friendId', '=', friendId)
      .$if(Boolean(searchQuery), (q) =>
        q.where('users.userName', 'like', status!),
      )
      .$if(Boolean(status), (q) => q.where('status', '=', status!))
      .execute();

    return entities.map((entity) => ({
      ...entity,
      user: {
        id: entity.user_id,
        email: entity.user_email,
        userName: entity.user_name,
        createdAt: entity.user_createdAt,
        isCompleted: entity.user_isCompleted,
        authProvider: entity.user_authProvider,
      },
      friend: null,
    }));
  }
}
