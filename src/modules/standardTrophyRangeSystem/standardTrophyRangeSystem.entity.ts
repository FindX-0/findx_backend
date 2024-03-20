import { Insertable, Selectable, Updateable } from 'kysely';

import { StandardTrophyRangeSystem } from '../../entities';

export type SelectableStandardTrophyRangeSystem =
  Selectable<StandardTrophyRangeSystem>;
export type NewStandardTrophyRangeSystem =
  Insertable<StandardTrophyRangeSystem>;
export type StandardTrophyRangeSystemUpdate =
  Updateable<StandardTrophyRangeSystem>;
