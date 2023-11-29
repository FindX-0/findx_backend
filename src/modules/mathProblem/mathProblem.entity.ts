import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/entityTypes';

export type SelectableMathProblem = Selectable<MathProblem>;
export type NewMathProblem = Insertable<MathProblem>;
export type MathProblemUpdate = Updateable<MathProblem>;
