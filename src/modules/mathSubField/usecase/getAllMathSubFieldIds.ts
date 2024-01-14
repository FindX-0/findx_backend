import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database/kyselyDb.type';

@Injectable()
export class GetAllMathSubFieldIds {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async getAllIds(): Promise<string[]> {
    const res = await this.db
      .selectFrom('mathSubFields')
      .select(['id'])
      .execute();

    return res.map((e) => e.id);
  }
}
