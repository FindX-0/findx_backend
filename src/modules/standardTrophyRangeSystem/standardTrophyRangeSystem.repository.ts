import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

import { SelectableStandardTrophyRangeSystem } from './standardTrophyRangeSystem.entity';
import { KyselyDB } from '../../config/database/kyselyDb.type';

@Injectable()
export class StandardTrophyRangeSystemRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async getBellowClosestByMathFieldId(params: {
    trophy: number;
    mathFieldId: string;
  }): Promise<SelectableStandardTrophyRangeSystem | null> {
    const { trophy, mathFieldId } = params;

    const entity = await this.db
      .selectFrom('standardTrophyRangeSystem')
      .selectAll()
      .where((eb) =>
        eb('mathFieldId', '=', mathFieldId).and('fromTrophy', '<=', trophy),
      )
      .orderBy('fromTrophy', 'desc')
      .limit(1)
      .executeTakeFirst();

    return entity ?? null;
  }
}
