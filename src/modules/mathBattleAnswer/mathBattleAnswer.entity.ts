import { Insertable, Selectable, Updateable } from 'kysely';

import { MathBattleAnswer } from '@entities/entityTypes';
import { SelectableMatch } from '@modules/matchmaking/entity/match.entity';
import { SelectableMathProblem } from '@modules/mathProblem/mathProblem.entity';
import { SelectableUser } from '@modules/user/user.entity';

export type SelectableMathBattleAnswer = Selectable<MathBattleAnswer>;

export type SelectableMathBattleAnswerWithRelations =
  SelectableMathBattleAnswer & {
    user?: Partial<SelectableUser> | null;
    mathProblem?: Partial<SelectableMathProblem> | null;
    match?: Partial<SelectableMatch> | null;
  };

export type NewMathBattleAnswer = Insertable<MathBattleAnswer>;

export type MathBattleAnswerUpdate = Updateable<MathBattleAnswer>;
