import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class GetAllMathFieldsInput {
  @Field()
  @Type(() => Boolean)
  onlyPublic: boolean;
}
