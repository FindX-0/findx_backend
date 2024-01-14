import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/index';

import { SelectableMathField } from '../mathField/mathField.entity';
import { SelectableMathSubField } from '../mathSubField/mathSubField.entity';
import { SelectableMediaFile } from '../mediaFile/mediaFile.entity';

type MathProblemRelations = {
  images: SelectableMediaFile[];
  mathField?: Partial<SelectableMathField> | null;
  mathSubField?: Partial<SelectableMathSubField> | null;
};

export type MathProblemAnswer = {
  tex: string;
  isCorrect: boolean;
};

export type MathProblemAnswerWoutCorrect = Omit<MathProblemAnswer, 'isCorrect'>;

type MathProblemAnswersField = { answers: MathProblemAnswer[] };

export type SelectableMathProblem = Omit<Selectable<MathProblem>, 'answers'> &
  MathProblemAnswersField;

export type SelectableMathBattleMathProblemWRelations = Omit<
  Selectable<MathProblem>,
  'answers'
> & {
  answers: MathProblemAnswerWoutCorrect[];
} & MathProblemRelations;

export type SelectableMathProblemWRelations = SelectableMathProblem &
  MathProblemRelations;

export type NewMathProblem = Omit<Insertable<MathProblem>, 'answers'> &
  MathProblemAnswersField;

export type MathProblemUpdate = Omit<Updateable<MathProblem>, 'answers'> &
  Partial<MathProblemAnswersField>;
