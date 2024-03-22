import { Insertable, Selectable } from 'kysely';

import { MathBattleResult } from '@entities/entityTypes';
import { SelectableMatch } from '@modules/matchmaking/entity/match.entity';
import { SelectableUser } from '@modules/user/user.type';

export type SelectableMathBattleResult = Selectable<MathBattleResult>;

export type SelectableMathBattleResultWithRelations =
  SelectableMathBattleResult & {
    user?: Partial<SelectableUser> | null;
    match?: Partial<SelectableMatch> | null;
  };

export type NewMathBattleResult = Insertable<MathBattleResult>;
