import { Insertable, Selectable, Updateable } from 'kysely';

import { MathProblem } from '@entities/index';

import { SelectableMathField } from '../mathField/mathField.entity';
import { SelectableMathSubField } from '../mathSubField/mathSubField.entity';
import { SelectableMediaFile } from '../mediaFile/mediaFile.entity';

export type MathProblemAnswer = {
  tex: string;
  isCorrect: boolean;
};

type MathProblemAnswersField = { answers: MathProblemAnswer[] };

export type SelectableMathProblem = Omit<Selectable<MathProblem>, 'answers'> &
  MathProblemAnswersField;

export type SelectableMathProblemWithRelations = SelectableMathProblem & {
  images: SelectableMediaFile[];
  mathField?: Partial<SelectableMathField> | null;
  mathSubField?: Partial<SelectableMathSubField> | null;
};

export type NewMathProblem = Omit<Insertable<MathProblem>, 'answers'> &
  MathProblemAnswersField;

export type MathProblemUpdate = Omit<Updateable<MathProblem>, 'answers'> &
  Partial<MathProblemAnswersField>;
