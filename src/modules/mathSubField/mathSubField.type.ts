import { LastIdPageParams } from '@shared/type';

export type CountMathSubFieldParams = {
  mathFieldId?: string | null;
};

export type FilterMathSubFieldParams = LastIdPageParams &
  CountMathSubFieldParams;
