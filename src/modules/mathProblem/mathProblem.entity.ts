import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/entityTypes';
import { SelectableMathField } from '@modules/mathField/mathField.entity';
import { SelectableMathSubField } from '@modules/mathSubField/mathSubField.entity';
import { SelectableMediaFile } from '@modules/mediaFile/mediaFile.entity';

export type SelectableMathProblem = Selectable<MathProblem>;
export type SelectableMathProblemWithRelations = Selectable<MathProblem> & {
  images: SelectableMediaFile[];
  mathField?: Partial<SelectableMathField> | null;
  mathSubField?: Partial<SelectableMathSubField> | null;
};

export type NewMathProblem = Insertable<MathProblem>;
export type MathProblemUpdate = Updateable<MathProblem>;
