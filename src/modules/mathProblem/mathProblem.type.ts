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
