import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { LastIdPageParamsObject } from '@shared/gql';

@InputType()
export class FilterMathSubFieldsInput extends LastIdPageParamsObject {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mathFieldId: string | null;
}
