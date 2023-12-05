import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/entityTypes';
import { SelectableMediaFile } from '@modules/mediaFile/mediaFile.entity';

export type SelectableMathProblem = Selectable<MathProblem>;
export type SelectableMathProblemWithRelations = Selectable<MathProblem> & {
  images: SelectableMediaFile[];
};

export type NewMathProblem = Insertable<MathProblem>;
export type MathProblemUpdate = Updateable<MathProblem>;
