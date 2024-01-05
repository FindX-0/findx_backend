import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateNewMathProblemValuesObject {
  @Field()
  correctAnswer: string;

  @Field()
  mathFieldId: string;

  @Field()
  mathSubFieldId: string;

  @Field()
  tex: string;
}
