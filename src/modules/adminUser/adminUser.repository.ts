import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { Role } from '@entities/entityEnums';

import { NewAdminUser, SelectableAdminUser } from './adminUser.entity';

@Injectable()
export class AdminUserRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(values: NewAdminUser): Promise<SelectableAdminUser | null> {
    const entity = await this.db
      .insertInto('adminUsers')
      .values(values)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async existsByEmail(email: string) {
    const res = await this.db
      .selectFrom('adminUsers')
      .where('email', '=', email)
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    return Boolean(res?.count && res.count > 0);
  }

  async getByEmail(email: string): Promise<SelectableAdminUser | null> {
    const entity = await this.db
      .selectFrom('adminUsers')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return entity ?? null;
  }

  async getById(id: string): Promise<SelectableAdminUser | null> {
    const entity = await this.db
      .selectFrom('adminUsers')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return entity ?? null;
  }

  async getRolesById(id: string): Promise<Role[] | null> {
    const res = await this.db
      .selectFrom('adminUsers')
      .select(['id', 'roles'])
      .where('id', '=', id)
      .executeTakeFirst();

    return res?.roles ?? null;
  }
}
