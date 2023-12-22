import { Insertable, Selectable, Updateable } from 'kysely';

import { MathSubField } from '@entities/entityTypes';
import { SelectableMathField } from '@modules/mathField/mathField.entity';

export type SelectableMathSubField = Selectable<MathSubField>;
export type SelectableMathSubFieldWithRelations = Selectable<MathSubField> & {
  mathField: Partial<SelectableMathField> | null;
};

export type NewMathSubField = Insertable<MathSubField>;
export type MathSubFieldUpdate = Updateable<MathSubField>;
