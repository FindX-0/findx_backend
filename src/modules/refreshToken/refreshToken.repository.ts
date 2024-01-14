import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

import { NewRefreshToken, SelectableRefreshToken } from './refreshToken.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    params: NewRefreshToken,
  ): Promise<SelectableRefreshToken | null> {
    const entity = await this.db
      .insertInto('refreshTokens')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async getUserIdByValue(value: string): Promise<string | null> {
    const res = await this.db
      .selectFrom('refreshTokens')
      .select('userId')
      .where('value', '=', value)
      .executeTakeFirst();

    return res?.userId ?? null;
  }

  async getAdminUserIdByValue(value: string): Promise<string | null> {
    const res = await this.db
      .selectFrom('refreshTokens')
      .select('adminUserId')
      .where('value', '=', value)
      .executeTakeFirst();

    return res?.adminUserId ?? null;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.db
      .deleteFrom('refreshTokens')
      .where('userId', '=', userId)
      .execute();
  }

  async deleteAllByAdminUserId(adminUserId: string) {
    await this.db
      .deleteFrom('refreshTokens')
      .where('adminUserId', '=', adminUserId)
      .execute();
  }

  async deleteByValue(value: string): Promise<void> {
    await this.db
      .deleteFrom('refreshTokens')
      .where('value', '=', value)
      .executeTakeFirst();
  }
}
