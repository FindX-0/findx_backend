import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';

import {
  NewAccountVerification,
  SelectableAccountVerification,
  UpdateAccountVerification,
} from './accountVerification.entity';

@Injectable()
export class AccountVerificationRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(params: NewAccountVerification): Promise<void> {
    await this.db.insertInto('accountVerification').values(params).execute();
  }

  async updateByUserId(
    userId: string,
    params: UpdateAccountVerification,
  ): Promise<void> {
    await this.db
      .updateTable('accountVerification')
      .where('userId', '=', userId)
      .set(params)
      .execute();
  }

  async getByUserId(
    userId: string,
  ): Promise<SelectableAccountVerification | null> {
    const entity = await this.db
      .selectFrom('accountVerification')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirst();

    return entity ?? null;
  }

  async getIsVerifiedByUserId(userId: string): Promise<boolean | null> {
    const res = await this.db
      .selectFrom('accountVerification')
      .select('isVerified')
      .where('userId', '=', userId)
      .executeTakeFirst();

    return (res && res.isVerified) ?? null;
  }

  async updateIsVerified(userId: string, isVerified: boolean) {
    await this.db
      .updateTable('accountVerification')
      .where('userId', '=', userId)
      .set({ isVerified })
      .execute();
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const res = await this.db
      .selectFrom('accountVerification')
      .where('userId', '=', userId)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    return Boolean(res && res.count > 0);
  }
}
