import { Injectable } from '@nestjs/common';
import { NewRefreshToken, SelectableRefreshToken } from '../../entities';
import { InjectKysely } from 'src/packages/kyselyModule';
import { KyselyDB } from 'src/config';

@Injectable()
export class RefreshTokenRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async createEntity(params: NewRefreshToken): Promise<SelectableRefreshToken> {
    return this.db
      .insertInto('refreshTokens')
      .values(params)
      .returningAll()
      .executeTakeFirst();
  }

  async getUserIdByValue(value: string): Promise<string | null> {
    const res = await this.db
      .selectFrom('refreshTokens')
      .select('userId')
      .where('value', '=', value)
      .executeTakeFirst();

    return res?.userId ?? null;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.db
      .deleteFrom('refreshTokens')
      .where('userId', '=', userId)
      .executeTakeFirst();
  }

  async deleteByValue(value: string): Promise<void> {
    await this.db
      .deleteFrom('refreshTokens')
      .where('value', '=', value)
      .executeTakeFirst();
  }
}
