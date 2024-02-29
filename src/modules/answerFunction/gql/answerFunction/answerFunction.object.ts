import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnswerFunctionObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  func: string;

  @Field(() => String, { nullable: true })
  condition: string | null;

  @Field(() => Float)
  weight: number;

  @Field(() => ID)
  mathSubFieldId: string;
}
