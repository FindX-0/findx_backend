import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/index';

import { SelectableMathField } from '../mathField/mathField.entity';
import { SelectableMathSubField } from '../mathSubField/mathSubField.entity';
import { SelectableMediaFile } from '../mediaFile/mediaFile.entity';

export type SelectableMathProblem = Selectable<MathProblem>;
export type SelectableMathProblemWithRelations = Selectable<MathProblem> & {
  images: SelectableMediaFile[];
  mathField?: Partial<SelectableMathField> | null;
  mathSubField?: Partial<SelectableMathSubField> | null;
};

export type NewMathProblem = Insertable<MathProblem>;
export type MathProblemUpdate = Updateable<MathProblem>;
