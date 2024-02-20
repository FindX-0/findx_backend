import { Field, InputType } from '@nestjs/graphql';

import { NumberType } from '../../../entities';

@InputType()
export class GetAllAnswerFunctionsInput {
  @Field(() => NumberType, { nullable: true })
  numberType: NumberType | null;
}
