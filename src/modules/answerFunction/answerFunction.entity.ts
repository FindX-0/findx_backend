import { Insertable, Selectable, Updateable } from 'kysely';

import { AnswerFunction } from '@entities/index';

export type SelectableAnswerFunction = Selectable<AnswerFunction>;
export type NewAnswerFunction = Insertable<AnswerFunction>;
export type AnswerFunctionUpdate = Updateable<AnswerFunction>;
