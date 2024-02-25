import { Field, ID, InputType } from '@nestjs/graphql';

import { LastIdPageParamsObject } from '../../../shared/gql';

@InputType()
export class FilterAnswerFunctionsInput extends LastIdPageParamsObject {
  @Field(() => ID, { nullable: true })
  mathSubFieldId: string | null;
}
