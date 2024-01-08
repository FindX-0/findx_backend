import { LastIdPageParams } from '@shared/type';

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
  correctAnswer: string | null;
  tex: string;
};
