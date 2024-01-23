import { Insertable, Selectable, Updateable } from 'kysely';

import { AnswerFunction } from '@entities/index';

export type SelectableAnswerFunction = Selectable<AnswerFunction>;
export type NewAnswerFunction = Insertable<AnswerFunction>;
export type AnswerFunctionUpdate = Updateable<AnswerFunction>;

export type NewAnswerFunctionWeightNum = Omit<NewAnswerFunction, 'weight'> & {
  weight: number;
};

export type AnswerFunctionUpdateWeightNum = Omit<
  AnswerFunctionUpdate,
  'weight'
> & { weight?: number };
