import { Insertable, Selectable, Updateable } from 'kysely';

import { MathSubField } from '@entities/index';

import { SelectableMathField } from '../mathField/mathField.entity';

export type SelectableMathSubField = Selectable<MathSubField>;
export type SelectableMathSubFieldWithRelations = Selectable<MathSubField> & {
  mathField: SelectableMathField | null;
};

export type NewMathSubField = Insertable<MathSubField>;
export type MathSubFieldUpdate = Updateable<MathSubField>;
