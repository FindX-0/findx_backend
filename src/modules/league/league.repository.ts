import { Injectable } from '@nestjs/common';

import { SelectableLeague } from './league.entity';
import { KyselyDB } from '../../config/database/kyselyDb.type';

@Injectable()
export class LeagueRepository {
  constructor(private readonly db: KyselyDB) {}

  async getBellowClosestToTrophyByMathFieldId(params: {
    trophy: number;
    mathFieldId: string;
  }): Promise<SelectableLeague | null> {
    const { trophy, mathFieldId } = params;

    const entity = await this.db
      .selectFrom('leagues')
      .selectAll()
      .where((eb) =>
        eb('mathFieldId', '=', mathFieldId).and('fromTrophy', '<', trophy),
      )
      .orderBy('fromTrophy', 'desc')
      .limit(1)
      .executeTakeFirst();

    return entity ?? null;
  }
}
