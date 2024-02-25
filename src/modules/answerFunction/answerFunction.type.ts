import { LastIdPageParams } from '../../shared/type';

export type GetAllAnswerFunctionParams = {
  notIncludeId?: string | null;
  mathSubFieldId?: string | null;
};

export type FilterAnswerFunctionParams = LastIdPageParams & {
  mathSubFieldId?: string | null;
};
