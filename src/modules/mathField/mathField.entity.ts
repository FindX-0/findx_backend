import { Insertable, Selectable, Updateable } from 'kysely';

import { MathField } from '@entities/entityTypes';

export type SelectableMathField = Selectable<MathField>;
export type NewMathField = Insertable<MathField>;
export type MathFieldUpdate = Updateable<MathField>;