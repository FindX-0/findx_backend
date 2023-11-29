import { Insertable, Selectable, Updateable } from 'kysely';

import { MathSubField } from '@entities/entityTypes';

export type SelectableMathSubField = Selectable<MathSubField>;
export type NewMathSubField = Insertable<MathSubField>;
export type MathSubFieldUpdate = Updateable<MathSubField>;
