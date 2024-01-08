import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateMathProblemValuesObject {
  @Field()
  correctAnswer: string;

  @Field()
  mathFieldId: string;

  @Field()
  mathSubFieldId: string;

  @Field()
  tex: string;
}
