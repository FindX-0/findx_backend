import { NumberType } from '../../entities';
import { LastIdPageParams } from '../../shared/type';

export type GetAllAnswerFunctionParams = {
  notIncludeId?: string | null;
  numberType?: NumberType | null;
};

export type FilterAnswerFunctionParams = LastIdPageParams & {
  numberType?: NumberType | null;
};
