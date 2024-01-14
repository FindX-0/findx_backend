import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathProblemAnswerWoutCorrectObject {
  @Field()
  tex: string;
}
