import { LastIdPageParams } from '@shared/type';

import { MathProblemAnswer } from './mathProblem.entity';

export type CountMathProblemParams = {
  mathSubFieldId?: string | null;
  mathFieldId?: string | null;
};

export type FilterMathProblemParams = LastIdPageParams &
  CountMathProblemParams & {
    includeMathField?: boolean;
    includeMathSubField?: boolean;
  };

export type TemplateNumberParam = {
  index: number;
  min: number;
  max: number;
  step: number;
};

export type TemplateCustomStrParam = {
  index: number;
  values: string;
};

type GenerateMathProblemValuesParams = {
  numberParams: TemplateNumberParam[];
  customStrParams: TemplateCustomStrParam[];
};

export type CountGenerateMathProblemValuesArgs =
  GenerateMathProblemValuesParams;

export type GenerateMathProblemValuesArgs = GenerateMathProblemValuesParams & {
  template: string;
};

export type GeneratedNewMathProblemValues = {
  answers: MathProblemAnswer[] | null;
  tex: string;
};
